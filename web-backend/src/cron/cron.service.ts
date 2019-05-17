import { Injectable } from '@nestjs/common';
import { DeleteResult, Repository } from 'typeorm';
import { Cron } from './cron.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CronPriority } from './cron-priority.entity';
import * as util from 'util';
import * as cp from 'child_process';
import * as fs from 'fs';
import { FileLogger } from '../logger/file-logger';
import { Project } from '../project/project.entity';
import { ConfigService } from '../config/config.service';

const pathToScriptInterface = `${__dirname}/../../data-processing`;

@Injectable()
export class CronService {
  constructor(
    @InjectRepository(Cron)
    private readonly cronRepository: Repository<Cron>,
    @InjectRepository(CronPriority)
    private readonly cronPriorityRepository: Repository<CronPriority>,
    private readonly logger: FileLogger,
    private readonly config: ConfigService,
  ) {}

  async getOwners(project: Project): Promise<Cron[]> {
    return await this.cronRepository.find({ owner: project });
  }

  async getAll(): Promise<Cron[]> {
    return await this.cronRepository.find();
  }

  async create(cron): Promise<Cron> {
    const savedCronPriorities = [];
    await Promise.all(
      cron.priorities.map(async scripts => {
        const newCronPriority = new CronPriority(null, scripts, null);

        savedCronPriorities.push(await this.cronPriorityRepository.save(newCronPriority));
      }),
    );
    cron.priorities = savedCronPriorities;
    const newCron: Cron = await this.cronRepository.save(cron);

    await this.writeCronTab(); // TODO if this fails then remove the created cron
    return newCron;
  }

  async remove(cronId: number): Promise<Error> {
    const res: DeleteResult = await this.cronRepository.delete(cronId);
    await this.writeCronTab();
    if (res.affected === 1) {
      return null;
    } else {
      const error = new Error('Failed to remove cron from database');
      this.logger.error(error.message);
      return error;
    }
  }

  async writeCronTab() {
    const crons = await this.getAll();
    const writeStream = fs.createWriteStream(`tempCronContent.txt`);
    const cronHeader = this.config.get('CRON_HEADER');
    writeStream.write(cronHeader);
    crons.map(cron => {
      let result = cron.schedule;
      let firstPriority = true;
      cron.priorities
        .map(priority => priority.scripts.map(script => script.id))
        .forEach(scripts => {
          result += firstPriority ? '' : ' && ('; // &&: sequential
          let first = true;
          scripts.forEach(scriptId => {
            result += first ? ' ' : ' & '; // &: parallel
            if (first) {
              first = false;
            }
            // each of those has to be run after another
            result += `/anaconda3/envs/script_${scriptId}/bin/python ${pathToScriptInterface}/script_interface.py ${scriptId} ${
              cron.id
            }`;
          });
          result += firstPriority ? '' : ' )';
          if (firstPriority) {
            firstPriority = false;
          }
        });
      result += '\n';
      writeStream.write(result);
    });
    writeStream.end();
    this.logger.log('Writing to crontab');
    const child = cp.spawn(`crontab tempCronContent.txt`, {
      detached: true,
      shell: '/bin/bash',
    });
    child.stderr.on('data', data => {
      this.logger.error(`Error while writing to crontab: ${data}`);
    });
  }
}
