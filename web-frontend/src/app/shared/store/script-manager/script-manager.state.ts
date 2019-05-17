import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
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
} from './script-manager.actions';
import { Script, ScriptRun } from '../../models/script-manager.model';
import { HttpClient } from '@angular/common/http';
import { switchMap, tap } from 'rxjs/operators';
import { Cron } from '../../models/cron.model';
import { MainState } from '../main/main.state';
import { environment } from '../../../../environments/environment';

export class ScriptManagerStateModel {
  public scripts: Script[];
  public history: ScriptRun[];
  public crons: Cron[];
}

@State<ScriptManagerStateModel>({
  name: 'scriptManager',
  defaults: {
    scripts: [],
    history: [],
    crons: []
  }
})
export class ScriptManagerState {
  constructor(private http: HttpClient, private store: Store) {}

  @Selector()
  static scripts(state: ScriptManagerStateModel) {
    return state.scripts;
  }

  @Selector()
  static history(state: ScriptManagerStateModel) {
    return state.history;
  }

  @Selector()
  static crons(state: ScriptManagerStateModel) {
    return state.crons;
  }

  @Action(GetScriptList)
  getScriptList(ctx: StateContext<ScriptManagerStateModel>) {
    return this.store.select(MainState.project).pipe(
      switchMap(projectId =>
        this.http.get<Script[]>(`${environment.apiUrl}/project/${projectId}/script-manager`).pipe(
          tap(scripts => {
            const state = ctx.getState();
            ctx.setState({ ...state, scripts });
          })
        )
      )
    );
  }

  @Action(GetScriptHistory)
  getScriptHistory(ctx: StateContext<ScriptManagerStateModel>) {
    return this.store.select(MainState.project).pipe(
      switchMap(projectId =>
        this.http.get<ScriptRun[]>(`${environment.apiUrl}/project/${projectId}/script-manager/history`).pipe(
          tap(history => {
            const state = ctx.getState();
            ctx.setState({ ...state, history });
          })
        )
      )
    );
  }

  @Action(CreateScript)
  createScript(ctx: StateContext<ScriptManagerStateModel>, { formData }: CreateScript) {
    return this.store.select(MainState.project).pipe(
      switchMap(projectId =>
        this.http.post(`${environment.apiUrl}/project/${projectId}/script-manager`, formData).pipe(
          tap((createdScript: Script) => {
            const state = ctx.getState();
            ctx.setState({ ...state, scripts: state.scripts.concat(createdScript) });
          })
        )
      )
    );
  }

  @Action(RunScript)
  runScript(ctx: StateContext<ScriptManagerStateModel>, { scriptId }: RunScript) {
    return this.store.select(MainState.project).pipe(
      switchMap(projectId =>
        this.http.get(`${environment.apiUrl}/project/${projectId}/script-manager/${scriptId}/run`).pipe(
          tap(() => {
            /* console.log(scriptRun);
        const state = ctx.getState();
        ctx.setState({ ...state, history: state.history.concat(scriptRun) }); */
          })
        )
      )
    );
  }

  @Action(TerminateScript)
  terminateScript(ctx: StateContext<ScriptManagerStateModel>, { scriptRunId }: TerminateScript) {
    return this.store.select(MainState.project).pipe(
      switchMap(projectId =>
        this.http.get(`${environment.apiUrl}/project/${projectId}/script-manager/${scriptRunId}/terminate`).pipe(
          tap(res => {
            // console.log(res);
          })
        )
      )
    );
  }

  @Action(DeleteScript)
  deleteScript(ctx: StateContext<ScriptManagerStateModel>, { scriptId }: DeleteScript) {
    // updating UI
    const scripts = ctx.getState().scripts.slice();
    const scriptIndex = scripts.findIndex((script: Script) => script.id === scriptId);
    scripts[scriptIndex].status = 'DELETING';
    const state = ctx.getState();
    ctx.setState({
      ...state,
      scripts
    });

    // running backend
    return this.store.select(MainState.project).pipe(
      switchMap(projectId =>
        this.http.delete(`${environment.apiUrl}/project/${projectId}/script-manager/${scriptId}`).pipe(
          tap(() => {
            const stateLater = ctx.getState();

            ctx.setState({
              ...stateLater,
              scripts: stateLater.scripts.filter((script: Script) => script.id !== scriptId),
              history: stateLater.history.filter((scriptRun: ScriptRun) => scriptRun.script.id !== scriptId)
              // TODO check if scriptRun.script is the id or the whole script
            });
          })
        )
      )
    );
  }

  /* crons */
  @Action(GetCronList)
  getCronList(ctx: StateContext<ScriptManagerStateModel>) {
    return this.store.select(MainState.project).pipe(
      switchMap(projectId =>
        this.http.get<Cron[]>(`${environment.apiUrl}/project/${projectId}/cron`).pipe(
          tap(crons => {
            const state = ctx.getState();
            ctx.setState({ ...state, crons });
          })
        )
      )
    );
  }

  @Action(CreateCron)
  createCron(ctx: StateContext<ScriptManagerStateModel>, { cron }: CreateCron) {
    return this.store.select(MainState.project).pipe(
      switchMap(projectId =>
        this.http.post<Cron>(`${environment.apiUrl}/project/${projectId}/cron`, cron).pipe(
          tap(createdCron => {
            const state = ctx.getState();
            ctx.setState({ ...state, crons: state.crons.concat(createdCron) });
          })
        )
      )
    );
  }

  @Action(DeleteCron)
  deleteCron(ctx: StateContext<ScriptManagerStateModel>, { cronId }: DeleteCron) {
    return this.store.select(MainState.project).pipe(
      switchMap(projectId =>
        this.http.delete(`${environment.apiUrl}/project/${projectId}/cron/${cronId}`).pipe(
          tap(() => {
            const state = ctx.getState();
            ctx.setState({
              ...state,
              crons: state.crons.filter((cron: Cron) => cron.id !== cronId)
            });
          })
        )
      )
    );
  }
}
