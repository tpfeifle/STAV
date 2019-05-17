import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CronService } from './cron.service';
import { Cron } from './cron.entity';
import { DeleteResult } from 'typeorm';
import { ProjectService } from '../project/project.service';
import { ApiUseTags } from '@nestjs/swagger';

@ApiUseTags('Cron')
@Controller('project/:projectId/cron')
export class CronController {
  constructor(
    private readonly cronService: CronService,
    private readonly projectService: ProjectService,
  ) {}

  @Post()
  async create(@Body() cron: Cron, @Param('projectId') projectId: number): Promise<Cron> {
    const project = await this.projectService.findOne(projectId);
    const newCron = new Cron(null, cron.title, cron.schedule, cron.priorities, project);
    return await this.cronService.create(newCron);
  }

  @Get()
  async getAll(@Param('projectId') projectId: number): Promise<Cron[]> {
    const project = await this.projectService.findOne(projectId);
    return await this.cronService.getOwners(project);
  }

  @Delete(':id')
  async remove(@Param('id') cronId: number): Promise<Error> {
    return await this.cronService.remove(cronId);
  }
}
