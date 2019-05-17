import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { MatDialog, MatDialogRef } from '@angular/material';
import { filter, first, takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { SheetSimple } from '../../shared/models/main.model';
import { SheetState } from '../../shared/store/sheet/sheet.state';
import { SensorDataState } from '../../shared/store/sensor-data/sensor-data.state';
import { Chart } from '../../shared/models/chart.model';
import { SensorTableModel } from '../../shared/models/sensor-table.model';
import { CloseChartEditor, UpdateChart } from '../../shared/store/sheet/sheet.actions';
import { GetSensorTableData, GetSensorTablesMetaData } from '../../shared/store/sensor-data/sensor-data.actions';
import { MainState } from '../../shared/store/main/main.state';
import { CreateSheet, DeleteSheet } from '../../shared/store/main/main.actions';
import { ActivatedRoute, Router } from '@angular/router';
 
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  sheets: SheetSimple[];
  componentDies$ = new Subject();

  @Select(SheetState.getChartToEdit)
  chartToEdit: Observable<Chart>;

  @Select(SensorDataState.getTables)
  sensorTables: Observable<SensorTableModel[]>;

  constructor(private store: Store, public dialog: MatDialog, public route: ActivatedRoute) {}

  ngOnInit() {
    this.store.select(MainState.project).subscribe(() => {
      this.store.dispatch(new GetSensorTablesMetaData());

      setTimeout(() => {
        this.store
          .select(SensorDataState.getTables)
          .pipe(
            filter(tables => tables.length > 0),
            first()
          )
          .subscribe((tables: SensorTableModel[]) => {
            tables.forEach(table => this.store.dispatch(new GetSensorTableData(table.id)));
          });
        this.store
          .select(MainState.getSheets)
          .pipe(takeUntil(this.componentDies$))
          .subscribe(sheets => {
            this.sheets = sheets;
          });
      }, 0);
    });
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(CreateDialogComponent, {
      width: '250px'
    });

    dialogRef
      .afterClosed()
      .pipe(first())
      .subscribe((name: string) => {
        if (name) {
          this.store.dispatch(new CreateSheet(name));
        }
      });
  }

  removeChartToEdit() {
    this.store.dispatch(new CloseChartEditor());
  }

  saveChart({ chart, parameters }) {
    this.store.dispatch(new UpdateChart(chart, parameters));
  }

  removeSheet(sheet: SheetSimple) {
    if (confirm('Are you sure that you want to delete this sheet and all its charts?')) {
      this.store.dispatch(new DeleteSheet(sheet.id));
    }
  }

  ngOnDestroy(): void {
    this.componentDies$.complete();
  }
}

@Component({
  selector: 'app-create-dashboard-dialog',
  templateUrl: 'create-dashboard-dialog.html'
})
export class CreateDialogComponent {
  constructor(public dialogRef: MatDialogRef<CreateDialogComponent>) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
