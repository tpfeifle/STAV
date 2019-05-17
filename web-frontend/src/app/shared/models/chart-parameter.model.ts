export class ChartParameter {
  id: number;
  chartId: number;
  templateParameter: string;
  assignedField: string;

  constructor(id: number, chartId: number, templateParameter: string, assignedField: string) {
    this.id = id;
    this.chartId = chartId;
    this.templateParameter = templateParameter;
    this.assignedField = assignedField;
  }
}

export class FormChartParameter {
  [key: string]: string;
}
