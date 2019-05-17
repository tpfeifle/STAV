import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SensorTableModel } from '../../../../shared/models/sensor-table.model';
import { Chart } from '../../../../shared/models/chart.model';

@Component({
  selector: 'app-chart-editor',
  templateUrl: './chart-editor.component.html',
  styleUrls: ['./chart-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChartEditorComponent implements OnInit, OnDestroy {
  @Input()
  chart: Chart;

  @Input()
  sensorTables: SensorTableModel[];

  @Output()
  save = new EventEmitter();

  selectedSensorTable: SensorTableModel;

  chartSizes: string[];

  fooForm: FormGroup;
  componentDies$ = new Subject();

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.selectedSensorTable = this.sensorTables.find(table => table.name === this.chart.sensorTable);
    this.chartSizes = ['1x1', '2x1', '3x1'];

    const chartParams = {};

    this.chart.parameters.forEach(param => {
      chartParams[param.templateParameter] = [param.assignedField, Validators.required];
    });
    console.log(chartParams);
    console.log(this.chart.parameters);

    this.fooForm = this.fb.group({
      selectSensorTable: [this.selectedSensorTable, Validators.required],
      selectParameters: this.fb.group(chartParams),
      query: [this.chart.query],
      selectChartSize: [`${this.chart.width}x${this.chart.height}`]
    });
  }

  update() {
    this.chart.sensorTable = this.fooForm.value.selectSensorTable.name;
    this.chart.query = this.fooForm.value.query;
    this.chart.width = this.fooForm.value.selectChartSize.split('x')[0];
    this.chart.height = this.fooForm.value.selectChartSize.split('x')[1];
    this.save.emit({ chart: this.chart, parameters: this.fooForm.value.selectParameters });
  }

  ngOnDestroy(): void {
    this.componentDies$.complete();
  }
}
