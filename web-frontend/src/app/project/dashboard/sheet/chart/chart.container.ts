import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Store } from '@ngxs/store';
import { ChartTemplate, chartTemplateIdToTemplate } from './chart-template';
import { SensorTableModel } from '../../../../shared/models/sensor-table.model';
import { Chart } from '../../../../shared/models/chart.model';
import { OpenChart, RemoveChart } from '../../../../shared/store/sheet/sheet.actions';
import { LineChart } from './templates/line-chart';

@Component({
  selector: 'app-chart-container',
  template: `
    <app-chart
      [chart]="chart"
      [chartTemplate]="chartTemplate"
      (removeEmitter)="remove()"
      (editEmitter)="edit()"
    ></app-chart>
  `
})
export class ChartContainerComponent implements OnChanges, OnDestroy, OnInit {
  @Input() chart: Chart;

  @Input() sensorTables: SensorTableModel[];

  chartTemplate: ChartTemplate;

  constructor(private store: Store) {}

  ngOnChanges(changes: SimpleChanges) {
    this.dealWithChanges(changes);
  }

  dealWithChanges(changes: SimpleChanges) {
    if (this.sensorTables.length > 0 && changes.sensorTables) {
      const currentSensorTable: SensorTableModel = changes.sensorTables.currentValue.find(
        (table: SensorTableModel) => table.name === this.chart.sensorTable
      );
      if (changes.sensorTables.previousValue && changes.sensorTables.previousValue.length !== 0) {
        const prevSensorTable: SensorTableModel = changes.sensorTables.previousValue.find(
          (table: SensorTableModel) => table.name === this.chart.sensorTable
        );
        if (prevSensorTable && currentSensorTable && prevSensorTable.data.length === currentSensorTable.data.length) {
          return;
        }
      }
      if (currentSensorTable && currentSensorTable.data.length > 1) {
        console.log(`changed - ${this.chart.id}`);
        const chartTemplate = chartTemplateIdToTemplate(this.chart.chartTemplateId, this.chart.id);

        chartTemplate.setTitle(this.chart.sensorTable);
        chartTemplate.setParameter(this.chart.parameters);
        chartTemplate.setSensorTable(currentSensorTable);
        this.chartTemplate = chartTemplate;
        // this.plotly = Object.assign({}, chartTemplate.options);
      }
    } else if (changes.chart) {
      const currentSensorTable: SensorTableModel = this.sensorTables.find(
        (table: SensorTableModel) => table.name === this.chart.sensorTable
      );
      const chartTemplate = chartTemplateIdToTemplate(this.chart.chartTemplateId, this.chart.id);
      chartTemplate.setTitle(this.chart.sensorTable);
      chartTemplate.setParameter(this.chart.parameters);
      chartTemplate.setSensorTable(currentSensorTable);
      this.chartTemplate = chartTemplate;
      // this.plotly = Object.assign({}, chartTemplate.options);
    }
  }

  remove() {
    this.store.dispatch(new RemoveChart(this.chart.id));
  }

  edit() {
    this.store.dispatch(new OpenChart(this.chart.id));
  }

  ngOnDestroy(): void {
    console.log(`destroyed - ${this.chart.id}`);
  }

  ngOnInit(): void {
    console.log(`init - ${this.chart.id}`);
  }
}
