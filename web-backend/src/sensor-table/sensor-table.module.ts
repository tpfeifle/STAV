import { Module } from '@nestjs/common';
import { SensorTableService } from './sensor-table.service';
import { SensorTableController } from './sensor-table.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Script } from '../script-manager/script.entity';
import { LoggerModule } from '../logger/LoggerModule';
import { ProjectService } from '../project/project.service';
import { Project } from '../project/project.entity';
import { Sheet } from '../sheet/sheet.entity';

@Module({
  providers: [SensorTableService, ProjectService],
  controllers: [SensorTableController],
  imports: [TypeOrmModule.forFeature([Script, Project, Sheet]), LoggerModule],
  exports: [SensorTableService],
})
export class SensorTableModule {}
