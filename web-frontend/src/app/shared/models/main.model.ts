import { Project } from './project.model';

export class SheetSimple {
  name: string;
  id: number;
}

export class ChartTemplate {
  name: string;
  parameters: string[];
  id: number;
}

export class MainStateModel {
  sheets: SheetSimple[];
  chartTemplates: ChartTemplate[];
  project: number;

  constructor(sheets: SheetSimple[], chartTemplates: ChartTemplate[], project: number) {
    this.sheets = sheets;
    this.chartTemplates = chartTemplates;
    this.project = project;
  }
}
