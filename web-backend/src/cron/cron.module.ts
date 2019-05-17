import { Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { CronController } from './cron.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cron } from './cron.entity';
import { Script } from '../script-manager/script.entity';
import { CronPriority } from './cron-priority.entity';
import { LoggerModule } from '../logger/LoggerModule';
import { ProjectService } from '../project/project.service';
import { Project } from '../project/project.entity';
import { Sheet } from '../sheet/sheet.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cron, CronPriority, Script, Project, Sheet]), LoggerModule],
  controllers: [CronController],
  providers: [CronService, ProjectService],
})
export class CronModule {}
