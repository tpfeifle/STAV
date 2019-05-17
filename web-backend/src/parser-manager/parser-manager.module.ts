import { Module } from '@nestjs/common';
import { ParserManagerService } from './parser-manager.service';
import { ParserManagerController } from './parser-manager.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Parser } from './parser.entity';
import { ProjectService } from '../project/project.service';
import { Project } from '../project/project.entity';
import { Sheet } from '../sheet/sheet.entity';

@Module({
  providers: [ParserManagerService, ProjectService],
  imports: [TypeOrmModule.forFeature([Parser, Project, Sheet])],
  controllers: [ParserManagerController],
})
export class ParserManagerModule {}
