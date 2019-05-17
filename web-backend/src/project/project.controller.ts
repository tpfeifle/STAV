import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ProjectService } from './project.service';
import { Project } from './project.entity';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  async create(@Body() project: Project): Promise<Project> {
    console.log(project);
    return await this.projectService.create(project);
  }

  @Get()
  async findAll(): Promise<Project[]> {
    return await this.projectService.findAll();
  }

  @Delete(':id')
  async remove(@Param('id') projectId: number): Promise<Error> {
    return await this.projectService.remove(projectId);
  }
}
