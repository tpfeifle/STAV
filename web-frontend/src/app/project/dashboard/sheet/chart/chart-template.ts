import { LineChart } from './templates/line-chart';
import { BarChart } from './templates/bar-chart';
import { MapChart } from './templates/map-chart';
import { ChartParameter } from '../../../../shared/models/chart-parameter.model';
import { SensorTableModel } from '../../../../shared/models/sensor-table.model';
import { DensityChart } from './templates/density-chart';
import { HeatMapChart } from './templates/heat-map-chart';
import { PointMapChart } from './templates/pointmap-chart';
import { TrajectoryMapChart } from './templates/trajectorymap-chart';

export interface ChartTemplate {
  name: string;
  parameters: ChartParameter[];
  id: number;
  options: any;
  sensorTable: SensorTableModel;
  visualizationLibrary: string;
  setParameter(parameters: ChartParameter[]);
  setSensorTable(sensortable: SensorTableModel);
  setTitle(title: string);
}

export function chartTemplateIdToTemplate(chartTemplateId: number, chartId: number) {
  switch (chartTemplateId) {
    case 1:
    default:
      return new LineChart();
    case 2:
      return new BarChart();
    case 3:
      return new MapChart(chartId);
    case 4:
      return new DensityChart();
    case 5:
      return new HeatMapChart(chartId);
    case 6:
      return new PointMapChart(chartId);
    case 7:
      return new TrajectoryMapChart(chartId);
  }
}
