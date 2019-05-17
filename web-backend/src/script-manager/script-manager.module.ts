import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Script } from './script.entity';
import { ScriptRun } from './script-run.entity';
import { ScriptManagerController } from './script-manager.controller';
import { ScriptManagerService } from './script-manager.service';
import { LoggerModule } from '../logger/LoggerModule';
import { ProjectService } from '../project/project.service';
import { Project } from '../project/project.entity';
import { Sheet } from '../sheet/sheet.entity';
import { SensorTableModule } from '../sensor-table/sensor-table.module';

@Module({
  imports: [TypeOrmModule.forFeature([Script, ScriptRun, Project, Sheet]), LoggerModule, SensorTableModule],
  controllers: [ScriptManagerController],
  providers: [ScriptManagerService, ProjectService],
})
export class ScriptManagerModule {}
