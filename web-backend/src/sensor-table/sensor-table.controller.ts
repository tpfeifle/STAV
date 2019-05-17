import { Controller, Get, Param } from '@nestjs/common';
import { SensorTableTemplate } from './sensor-table';
import { SensorTableService } from './sensor-table.service';
import { ProjectService } from '../project/project.service';
import { ApiUseTags } from '@nestjs/swagger';

@ApiUseTags('SensorTable')
@Controller('project/:projectId/sensor-table')
export class SensorTableController {
  constructor(private readonly sensorTableService: SensorTableService,
              private readonly projectService: ProjectService) {}

  @Get('meta')
  async getMetaData(@Param('projectId') projectId: number): Promise<SensorTableTemplate[]> {
    const project = await this.projectService.findOne(projectId);
    return await this.sensorTableService.getMetaData(project);
  }

  @Get(':id/data')
  async getData(@Param('id') scriptId: number): Promise<[]> {
    return await this.sensorTableService.getData(scriptId);
  }
}
