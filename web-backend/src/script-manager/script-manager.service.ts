import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Script } from './script.entity';
import { ScriptRun } from './script-run.entity';
import * as cp from 'child_process';
import * as util from 'util';
import * as fs from 'fs';
import { FileLogger } from '../logger/file-logger';
import { Project } from '../project/project.entity';
import { ConfigService } from '../config/config.service';
import { SensorTableService } from '../sensor-table/sensor-table.service';

const exec = util.promisify(cp.exec);
const spawn = util.promisify(cp.spawn);
const unlink = util.promisify(fs.unlink);
const rmdir = util.promisify(fs.rmdir);
const mkdir = util.promisify(fs.mkdir);
const readFile = util.promisify(fs.readFile);

const pathToScriptInterface = `${__dirname}/../../data-processing`;
const pathToScripts = `${pathToScriptInterface}/scripts`;

@Injectable()
export class ScriptManagerService {
  constructor(
    @InjectRepository(Script)
    private readonly scriptRepository: Repository<Script>,
    @InjectRepository(ScriptRun)
    private readonly scriptRunRepository: Repository<ScriptRun>,
    private readonly logger: FileLogger,
    private readonly config: ConfigService,
    private readonly sensorTableService: SensorTableService,
  ) {}

  async getAll(project: Project): Promise<Script[]> {
    return await this.scriptRepository.find({ owner: project });
  }

  async getHistory(owner: Project): Promise<ScriptRun[]> {
    const ownerId = owner.id;
    return await this.scriptRunRepository
      .createQueryBuilder('run')
      .leftJoinAndSelect('run.script', 'script')
      .leftJoinAndSelect('script.owner', 'owner')
      .where('owner.id = :ownerId', { ownerId })
      .getMany();
  }

  async create(script: Script, fileScript, filePipRequirements): Promise<Script> {
    const createdScript = await this.scriptRepository.save(script);
    this.createFolders(createdScript, fileScript, filePipRequirements);
    return createdScript;
  }

  async createFolders(script: Script, fileScript, filePipRequirements): Promise<Error> {
    const directory = `${pathToScripts}/${script.id}`;
    let error = null;
    try {
      await mkdir(directory);

      // write script to storage
      const writeStream = fs.createWriteStream(`${directory}/${script.id}.py`);
      writeStream.write(fileScript.buffer);
      writeStream.end();

      // write pip-requirements to storage
      const writeStreamPip = fs.createWriteStream(`${directory}/${script.id}-pipRequirements.txt`);
      writeStreamPip.write(filePipRequirements.buffer);
      writeStreamPip.end();

      const { stdout, stderr } = await exec(
        `conda init bash && conda create -n script_${script.id} pip psycopg2 --yes -q &&
          source activate script_${
            script.id
          } && pip install python-dotenv && pip install -r ${directory}/${
          script.id
        }-pipRequirements.txt`,
        { shell: '/bin/bash' },
      );
      script.status = 'READY';
      this.logger.log(`Output from creating script: stderr ${stderr}`);
    } catch (err) {
      this.logger.log(`Error while creating script: ${err}`);
      script.status = 'DEPLOY_FAILED';
      error = new Error(`Failed to deploy script: ${err}`);
    }
    await this.scriptRepository.update(script.id, script);
    return error;
  }

  async remove(scriptId: number): Promise<Error> {
    const directory = `${pathToScripts}/${scriptId}`;

    try {
      await this.scriptRepository.delete(scriptId);
      await this.sensorTableService.dropScriptTable(scriptId);
      this.deleteFolderRecursive(directory);
      await exec(`conda env remove -n script_${scriptId}`);
    } catch (err) {
      this.logger.error(`Error while removing script: ${err}`);
      return err as Error;
    }
  }

  // be careful with usage
  deleteFolderRecursive(path) {
    if (fs.existsSync(path)) {
      fs.readdirSync(path).forEach(file => {
        const curPath = path + '/' + file;
        if (fs.lstatSync(curPath).isDirectory()) {
          // recurse
          this.deleteFolderRecursive(curPath);
        } else {
          // delete file
          fs.unlinkSync(curPath);
        }
      });
      fs.rmdirSync(path);
    }
  }

  executeScript(scriptId: number) {
    const child = cp.spawn(
      `${this.config.get(
        'ANACONDA_PATH',
      )}/envs/script_${scriptId}/bin/python ${pathToScriptInterface}/script_interface.py ${scriptId}`,
      { detached: true, shell: '/bin/bash' }, // TODO detached: true, stdio: 'ignore', check which work
    );

    child.stdout.on('data', data => {
      console.log(`ps stdout ${data}`);
    });
    child.on('close', code => {
      console.log(1);
      console.log(code);
    });
    child.stderr.on('data', data => {
      console.log(`ps stderr ${data}`);
    });

    child.on('exit', async code => {
      console.log('close');
    });
  }

  async terminateScript(scriptRunId: number): Promise<ScriptRun> {
    this.logger.log(`Terminated scriptRun with ID:${scriptRunId}`);
    const runningScript = await this.scriptRunRepository.findOne(scriptRunId);
    cp.exec(`kill -9 ${runningScript.pid}`);

    runningScript.status = 'TERMINATED';
    runningScript.pid = null;
    await this.scriptRunRepository.update(runningScript.id, runningScript);
    return runningScript;
  }

  async getCode(scriptId: number) {
    return readFile(`${pathToScripts}/${scriptId}/${scriptId}.py`, 'utf8');
  }
}
