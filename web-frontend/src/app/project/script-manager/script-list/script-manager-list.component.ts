import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { Script } from '../../../shared/models/script-manager.model';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-script-manager-list',
  templateUrl: './script-manager-list.component.html',
  styleUrls: ['./script-manager-list.component.scss']
})
export class ScriptManagerListComponent implements OnInit, OnChanges {
  @Input() scripts: Script[];
  @Output() runScriptEmitter = new EventEmitter();
  @Output() deleteScriptEmitter = new EventEmitter();
  @Output() refreshScriptsEmitter = new EventEmitter();

  scriptsDataSource: MatTableDataSource<Script>;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  displayedColumns: string[] = ['id', 'title', 'status', 'action'];

  constructor() {}

  ngOnInit() {}

  ngOnChanges(): void {
    this.scriptsDataSource = new MatTableDataSource(this.scripts);
    this.scriptsDataSource.paginator = this.paginator;
  }

  deleteScript(script: Script) {
    this.deleteScriptEmitter.emit(script);
  }

  runScript(script: Script) {
    this.runScriptEmitter.emit(script);
  }

  refreshScripts() {
    this.refreshScriptsEmitter.emit();
  }

  getCode(script: Script) {
    window.open(`${environment.apiUrl}/script-manager/${script.id}/code`, '_blank');
  }
}
