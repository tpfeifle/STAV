import { Injectable } from '@nestjs/common';
import { Script } from '../script-manager/script.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SensorTable, SensorTableTemplate } from './sensor-table';
import { FileLogger } from '../logger/file-logger';
import { Project } from '../project/project.entity';
import { ConfigService } from '../config/config.service';

@Injectable()
export class SensorTableService {
  pool: any;
  isConnected: boolean;
  constructor(
    @InjectRepository(Script)
    private readonly scriptRepository: Repository<Script>,
    private readonly logger: FileLogger,
    private readonly config: ConfigService,
  ) {
    const { Pool } = require('pg');
    this.pool = new Pool({
      host: config.get('DB_HOST'),
      port: 5432,
      user: config.get('DB_USER'),
      database: config.get('DB_NAME_SENSOR'),
      password: config.get('DB_PASSWORD'),
    });
  }

  static async asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }

  async getMetaData(project: Project): Promise<SensorTableTemplate[]> {
    if (this.isConnected === false) {
      await this.pool.connect();
      this.isConnected = true;
    }
    const metaData = [];
    const scripts: Script[] = await this.scriptRepository.find({ owner: project });

    const waitForScriptsAsync = async () => {
      await SensorTableService.asyncForEach(scripts, async (script: Script) => {
        let fields = [];
        try {
          const res = await this.pool.query(`SELECT * FROM script_${script.id} LIMIT 1`);
          fields = res.fields.map(field => field.name);
        } catch (err) {
          // this.logger.error((err as Error).message, (err as Error).stack);
        }
        const sensorTable = new SensorTable(script.id, script.title, fields, [[]]);
        metaData.push(sensorTable);
      });
    };
    await waitForScriptsAsync();
    return metaData;
  }

  async dropScriptTable(scriptId: number) {
    await this.pool.query(`DROP TABLE IF EXISTS script_${scriptId}`);
  }

  async getData(scriptId: number, maxRecords: number = 999999999): Promise<[]> {
    // TODO: think about how to exactly query this!!!!!
    // more on data sampling is here for T-SQL: https://www.mssqltips.com/sqlservertip/3157/different-ways-to-get-random-data-for-sql-server-data-sampling/
    if (this.isConnected === false) {
      await this.pool.connect(); // TODO: this creates too many clients (at least it did before using end)
      this.isConnected = true;
    }
    try {
      const res = await this.pool.query({
        text: `SELECT * FROM script_${scriptId} LIMIT ${maxRecords}`,
        rowMode: 'array',
      });
      return res.rows;
    } catch (err) {
      // this.logger.error((err as Error).message, (err as Error).stack);
      return [];
    }
  }
}
