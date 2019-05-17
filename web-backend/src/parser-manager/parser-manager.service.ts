import { Injectable } from '@nestjs/common';
import { Parser } from './parser.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../project/project.entity';
import * as fs from 'fs';
import * as util from 'util';
import * as cp from 'child_process';
import { ConfigService } from '../config/config.service';
const mkdir = util.promisify(fs.mkdir);
const unlink = util.promisify(fs.unlink);
const rmdir = util.promisify(fs.rmdir);
const exec = util.promisify(cp.exec);
const pathToParsers = `${__dirname}/../../parser`;

@Injectable()
export class ParserManagerService {
  constructor(
    @InjectRepository(Parser)
    private readonly parserRepository: Repository<Parser>,
    private readonly config: ConfigService,
  ) {
    this.startAllParser();
  }

  async create(parser: Parser, parserFiles: File[], filePipRequirements: File): Promise<Parser> {
    const createdParser = await this.parserRepository.save(parser);
    this.createFolders(createdParser, parserFiles, filePipRequirements);
    return createdParser;
  }

  async createFolders(parser: Parser, parserFiles, filePipRequirements) {
    const directory = `${pathToParsers}/${parser.id}`;
    let error = null;
    try {
      await mkdir(directory);

      // write parser to storage
      for (let i = 0; i < parserFiles.length; i++) {
        const writeStream = fs.createWriteStream(`${directory}/${parserFiles[i].originalname}`);
        writeStream.write(parserFiles[i].buffer);
        writeStream.end();
      }

      // write pip-requirements to storage
      const writeStreamPip = fs.createWriteStream(`${directory}/pipRequirements.txt`);
      if (filePipRequirements && Buffer.isBuffer(filePipRequirements.buffer)) {
        writeStreamPip.write(filePipRequirements.buffer);
      }
      writeStreamPip.end();

      await exec(
        `conda init bash && conda create -n parser_${parser.id} pip psycopg2 --yes -q &&
          source activate parser_${
            parser.id
          } && pip install python-dotenv paho-mqtt protobuf && pip install -r ${directory}/pipRequirements.txt`,
        { shell: '/bin/bash' },
      );
    } catch (err) {
      error = new Error(`Failed to deploy parser: ${err}`);
      throw err;
    }
    await this.initParser(parser.id);
    this.runParser(parser.id);
    return error;
  }

  async findAll(owner: Project): Promise<Parser[]> {
    return await this.parserRepository.find({ owner });
  }

  async initParser(parserId: number) {
    console.log('init parser - ' + parserId);
    const child = cp.spawn(
      `${this.config.get(
        'ANACONDA_PATH',
      )}/envs/parser_${parserId}/bin/python ${pathToParsers}/parser_interface.py ${parserId} init`,
      { detached: true, shell: '/bin/bash' },
    );
    child.stderr.on('data', data => {
      console.log(`ps stderr ${data}`);
    });
  }

  async runParser(parserId: number) {
    console.log('started parser - ' + parserId);
    cp.exec(
      `${this.config.get(
        'ANACONDA_PATH',
      )}/envs/parser_${parserId}/bin/python ${pathToParsers}/parser_interface.py ${parserId}`,
    );
  }

  async clearParser(parserId: number) {
    console.log('clear parser - ' + parserId);
    const child = cp.spawn(
      `${this.config.get(
        'ANACONDA_PATH',
      )}/envs/parser_${parserId}/bin/python ${pathToParsers}/parser_interface.py ${parserId} clear`,
      { detached: true, shell: '/bin/bash' },
    );
    child.stderr.on('data', data => {
      console.log(`ps stderr ${data}`);
    });
  }

  async startAllParser() {
    cp.execFile('pkill', ['-f', 'parser_interface.py']);
    const parsers: Parser[] = await this.parserRepository.find();
    parsers.forEach(parser => this.runParser(parser.id));
  }

  async remove(parserId: number) {
    const directory = `${pathToParsers}/${parserId}`;

    try {
      await this.parserRepository.delete(parserId);
      this.deleteFolderRecursive(directory);
      exec(`conda env remove -n parser_${parserId}`);
      cp.execFile('pkill', ['-f', `parser_interface.py ${parserId}`]);
    } catch (err) {
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
}
