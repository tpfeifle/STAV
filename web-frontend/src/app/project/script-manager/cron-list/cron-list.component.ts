import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { Cron } from '../../../shared/models/cron.model';

@Component({
  selector: 'app-cron-list',
  templateUrl: './cron-list.component.html',
  styleUrls: ['./cron-list.component.scss']
})
export class CronListComponent implements OnInit, OnChanges {
  @Input() crons: Cron[];
  @Output() refreshCronsEmitter = new EventEmitter();
  @Output() deleteCronEmitter = new EventEmitter();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  cronsDataSource: MatTableDataSource<Cron>;

  displayedColumns: string[] = ['id', 'title', 'schedule', 'scripts', 'action'];
  constructor() {}

  ngOnInit() {}

  ngOnChanges(): void {
    this.cronsDataSource = new MatTableDataSource(this.crons);
    this.cronsDataSource.paginator = this.paginator;
  }

  refreshCrons() {
    this.refreshCronsEmitter.emit();
  }

  deleteCron(cron: Cron) {
    this.deleteCronEmitter.emit(cron);
  }
}
