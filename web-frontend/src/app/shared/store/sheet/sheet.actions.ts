import { Chart } from '../../models/chart.model';
import { FormChartParameter } from '../../models/chart-parameter.model';

export class GetSheet {
  static readonly type = '[Sheet] GetSheet';
  constructor(public sheetId: number) {}
}

export class AddChart {
  static readonly type = '[Sheet] AddChart';
  constructor(public newChart: Chart) {}
}

export class RemoveChart {
  static readonly type = '[Sheet] RemoveChart';
  constructor(public chartId: number) {}
}

export class CloseChartEditor {
  static readonly type = '[Sheet] Close ChartEditor';
  constructor() {}
}

export class OpenChart {
  static readonly type = '[Sheet] Open ChartEditor';
  constructor(public chartId: number) {}
}


export class UpdateChart {
  static readonly type = '[Sheet] Update Chart';
  constructor(public chart: Chart, public chartParameters: FormChartParameter) {}
}

export class UpdateChartParameters {
  static readonly type = '[Sheet] Update Chart Parameters';
  constructor(public chartId: number, public chartParameters: FormChartParameter) {}
}
