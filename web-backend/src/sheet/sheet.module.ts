import { Module } from '@nestjs/common';
import { SheetController } from './sheet.controller';
import { SheetService } from './sheet.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sheet } from './sheet.entity';
import { LoggerModule } from '../logger/LoggerModule';
import { Project } from '../project/project.entity';
import { ProjectService } from '../project/project.service';

@Module({
  imports: [TypeOrmModule.forFeature([Sheet, Project]), LoggerModule],
  controllers: [SheetController],
  providers: [SheetService, ProjectService],
})
export class SheetModule {
}
