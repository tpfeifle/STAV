import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { SheetModule } from './sheet/sheet.module';
import { ChartModule } from './chart/chart.module';
import { ScriptManagerModule } from './script-manager/script-manager.module';
import { SensorTableModule } from './sensor-table/sensor-table.module';
import { CronModule } from './cron/cron.module';
import { ProjectModule } from './project/project.module';
import { ParserManagerModule } from './parser-manager/parser-manager.module';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        type: 'postgres' as 'postgres',
        host: config.get('DB_HOST'),
        port: 5432,
        username: config.get('DB_USER'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_NAME_PLATFORM'),
        entities: ['src/**/**.entity{.ts,.js}'],
        synchronize: true,
      }),
    }),
    SheetModule,
    ChartModule,
    ScriptManagerModule,
    SensorTableModule,
    CronModule,
    ProjectModule,
    ParserManagerModule,
    ConfigModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private readonly connection: Connection) {}
}
