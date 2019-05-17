import { ChartParameter } from './chart-parameter.model';

export class Chart {
  id: number;
  chartTemplateId: number;
  parameters: ChartParameter[];
  height: number;
  width: number;
  sensorTable: string;
  query: string;

  constructor(
    id: number,
    chartTemplateId: number,
    parameters: ChartParameter[],
    height: number,
    width: number,
    sensorTable: string,
    query: string
  ) {
    this.id = id;
    this.chartTemplateId = chartTemplateId;
    this.parameters = parameters;
    this.height = height;
    this.width = width;
    this.sensorTable = sensorTable;
    this.query = query;
  }
}
