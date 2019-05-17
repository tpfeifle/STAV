import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { ScriptRun } from '../../../shared/models/script-manager.model';

@Component({
  selector: 'app-script-manager-history',
  templateUrl: './script-manager-history.component.html',
  styleUrls: ['./script-manager-history.component.scss']
})
export class ScriptManagerHistoryComponent implements OnInit, OnChanges {
  @Input() history: ScriptRun[];
  @Output() refresh = new EventEmitter();
  @Output() terminateScriptEmitter = new EventEmitter();

  historyDataSource: MatTableDataSource<ScriptRun>;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: string[] = ['script', 'timestamp', 'status', 'pid', 'cron', 'error', 'action'];

  constructor() {}

  ngOnInit() {}

  ngOnChanges() {
    this.historyDataSource = new MatTableDataSource(this.history);
    this.historyDataSource.sort = this.sort;
    this.historyDataSource.paginator = this.paginator;
  }

  terminateScript(scriptRun: ScriptRun) {
    this.terminateScriptEmitter.emit(scriptRun);
  }

  refreshHistory() {
    this.refresh.emit();
  }
}
