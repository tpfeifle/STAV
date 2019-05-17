import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { SheetState } from '../../../shared/store/sheet/sheet.state';
import { Chart } from '../../../shared/models/chart.model';
import { SensorDataState } from '../../../shared/store/sensor-data/sensor-data.state';
import { SensorTableModel } from '../../../shared/models/sensor-table.model';
import { AddChart, GetSheet } from '../../../shared/store/sheet/sheet.actions';

@Component({
  selector: 'app-sheet',
  templateUrl: './sheet.component.html',
  styleUrls: ['./sheet.component.scss']
})
export class SheetComponent implements OnInit, OnDestroy {
  @Select(SheetState.getCharts)
  charts: Observable<Chart[]>;

  sheetId: number;

  @Select(SensorDataState.getTables)
  sensorTables: Observable<SensorTableModel[]>;

  componentDies$ = new Subject();

  constructor(private store: Store, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.pipe(takeUntil(this.componentDies$)).subscribe(params => {
      this.sheetId = params.id;
      this.store.dispatch(new GetSheet(this.sheetId));
    });
  }

  addChart(templateId) {
    const newChart = new Chart(null, templateId, [], null, null, '', '');
    this.store.dispatch(new AddChart(newChart));
  }

  ngOnDestroy(): void {
    this.componentDies$.complete();
  }

  chartIdentity(index, chart: Chart) {
    return chart.id;
  }
}
