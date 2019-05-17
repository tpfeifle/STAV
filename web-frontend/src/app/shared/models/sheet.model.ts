import { Chart } from './chart.model';

export class SheetStateModel {
  id: number;
  name: string;
  charts: Chart[];
  editorChartId: number;

  constructor(id: number, name: string, charts: Chart[], editorChartId: number) {
    this.id = id;
    this.name = name;
    this.charts = charts;
    this.editorChartId = editorChartId;
  }
}
