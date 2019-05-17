import { Module } from '@nestjs/common';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './project.entity';
import { LoggerModule } from '../logger/LoggerModule';
import { Sheet } from '../sheet/sheet.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Project, Sheet]), LoggerModule],
  controllers: [ProjectController],
  providers: [ProjectService],
})
export class ProjectModule {}
