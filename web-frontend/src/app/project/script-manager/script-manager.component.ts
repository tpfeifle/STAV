import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { ScriptManagerState } from '../../shared/store/script-manager/script-manager.state';
import { Script, ScriptRun } from '../../shared/models/script-manager.model';
import { Cron } from '../../shared/models/cron.model';
import {
  CreateCron,
  CreateScript,
  DeleteCron,
  DeleteScript,
  GetCronList,
  GetScriptHistory,
  GetScriptList,
  RunScript,
  TerminateScript
} from '../../shared/store/script-manager/script-manager.actions';

@Component({
  selector: 'app-script-manager',
  templateUrl: './script-manager.component.html',
  styleUrls: ['./script-manager.component.scss']
})
export class ScriptManagerComponent implements OnInit {
  @Select(ScriptManagerState.scripts)
  scripts$: Observable<Script[]>;

  @Select(ScriptManagerState.history)
  history$: Observable<ScriptRun[]>;

  @Select(ScriptManagerState.crons)
  crons$: Observable<Cron[]>;

  constructor(private store: Store) {}

  ngOnInit() {
    this.store.dispatch(new GetScriptList());
    this.store.dispatch(new GetScriptHistory());
    this.store.dispatch(new GetCronList());
  }

  runScript(script: Script) {
    this.store.dispatch(new RunScript(script.id));
  }

  deleteScript(script: Script) {
    console.log(script);
    this.store.dispatch(new DeleteScript(script.id));
  }

  terminateScript(scriptRun: ScriptRun) {
    console.log('terminate');
    this.store.dispatch(new TerminateScript(scriptRun.id));
  }

  create(formData: FormData) {
    console.log(formData);
    this.store.dispatch(new CreateScript(formData));
  }

  refreshHistory() {
    this.store.dispatch(new GetScriptHistory());
  }

  refreshScripts() {
    this.store.dispatch(new GetScriptList());
  }

  refreshCrons() {
    this.store.dispatch(new GetCronList());
  }

  createCron(cron: Cron) {
    this.store.dispatch(new CreateCron(cron));
  }

  deleteCron(cron: Cron) {
    this.store.dispatch(new DeleteCron(cron.id));
  }
}
