import { Body, Controller, Delete, Param, Post, Put } from '@nestjs/common';
import { Chart } from './chart.entity';
import { ChartService } from './chart.service';
import { ApiResponse, ApiUseTags } from '@nestjs/swagger';

@ApiUseTags('Chart')
@Controller('project/:projectId/sheet/:sheetId/chart')
export class ChartController {
  constructor(private readonly chartService: ChartService) {}

  @Post()
  @ApiResponse({ status: 200, type: Chart })
  async create(@Param('sheetId') sheetId: number, @Body() chart: Chart): Promise<Chart> {
    return await this.chartService.create(sheetId, chart);
  }

  @Put()
  @ApiResponse({ status: 200, type: Chart })
  async update(@Body() chart: Chart): Promise<Chart> {
    return await this.chartService.update(chart);
  }

  @Delete(':id')
  async remove(@Param('id') componentId: number): Promise<Error> {
    return await this.chartService.remove(componentId);
  }
}
