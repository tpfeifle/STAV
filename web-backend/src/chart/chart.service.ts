import { Injectable } from '@nestjs/common';
import { Chart } from './chart.entity';
import { DeleteResult, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { getParametersByChartTemplateId } from '../chart-template/chart-template';
import { ChartParameter } from './chart-parameter.entity';
import { Sheet } from '../sheet/sheet.entity';

@Injectable()
export class ChartService {
  constructor(
    @InjectRepository(Chart)
    private readonly chartRepository: Repository<Chart>,
    @InjectRepository(ChartParameter)
    private readonly chartParameterRepository: Repository<ChartParameter>,
    @InjectRepository(Sheet)
    private readonly sheetRepository: Repository<Sheet>,
  ) {}

  async create(sheetId: number, chart: Chart): Promise<Chart> {
    const sheet = await this.sheetRepository.findOne(sheetId);

    let newChart = new Chart(
      null,
      sheet,
      chart.chartTemplateId,
      1,
      1,
      chart.parameters,
      chart.sensorTable,
      chart.query,
    );
    newChart = await this.chartRepository.save(newChart);
    console.log(newChart);

    const parameterList: string[] = getParametersByChartTemplateId(chart.chartTemplateId);

    await Promise.all(
      parameterList.map(async parameter => {
        const chartParameter = new ChartParameter(null, newChart.id, parameter, null);
        await this.chartParameterRepository.save(chartParameter);
      }),
    );

    return await this.chartRepository.findOne(newChart.id);
  }

  async update(chart: Chart): Promise<Chart> {
    const updatedChart = new Chart(
      chart.id,
      chart.sheet,
      chart.chartTemplateId,
      chart.width,
      chart.height,
      [], // this removes all existing fields
      chart.sensorTable,
      chart.query,
    );
    await this.chartRepository.save(updatedChart);

    await Promise.all(
      chart.parameters.map(async param => {
        const updatedParameter = new ChartParameter(
          param.id,
          chart.id,
          param.templateParameter,
          param.assignedField,
        );
        await this.chartParameterRepository.update(param.id, updatedParameter);
      }),
    );
    return await this.chartRepository.findOne(chart.id);
  }

  async remove(chartId: number): Promise<Error> {
    const res: DeleteResult = await this.chartRepository.delete(chartId);
    if (res.affected === 1) {
      return null;
    } else {
      return new Error('Failed to remove chart from Database');
    }
  }
}
