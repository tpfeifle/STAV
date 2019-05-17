import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { GetSensorTableData, GetSensorTablesMetaData } from './sensor-data.actions';
import { switchMap, tap } from 'rxjs/operators';
import { SensorTableModel } from '../../models/sensor-table.model';
import { HttpClient } from '@angular/common/http';
import { MainState } from '../main/main.state';
import { environment } from '../../../../environments/environment';

export class SensorDataStateModel {
  public tables: SensorTableModel[];
}

@State<SensorDataStateModel>({
  name: 'sensorData',
  defaults: {
    tables: []
  }
})
export class SensorDataState {
  constructor(private http: HttpClient, private store: Store) {}

  @Selector()
  static getTables(state: SensorDataStateModel) {
    return state.tables;
  }

  @Action(GetSensorTablesMetaData)
  getMetaData(ctx: StateContext<SensorDataStateModel>) {
    return this.store.select(MainState.project).pipe(
      switchMap(projectId =>
        this.http.get<SensorTableModel[]>(`${environment.apiUrl}/project/${projectId}/sensor-table/meta`).pipe(
          tap((sensorTables: SensorTableModel[]) => {
            const tables = sensorTables.slice();
            ctx.setState({
              tables
            });
          })
        )
      )
    );
  }

  @Action(GetSensorTableData)
  getData(ctx: StateContext<SensorDataStateModel>, { scriptId }: GetSensorTableData) {
    return this.store.select(MainState.project).pipe(
      switchMap(projectId =>
        this.http.get<any[]>(`${environment.apiUrl}/project/${projectId}/sensor-table/${scriptId}/data`).pipe(
          tap((data: any[]) => {
            const state = ctx.getState();
            const tables = state.tables.slice();
            const tableIndex = tables.findIndex((table: SensorTableModel) => table.id === scriptId);
            tables[tableIndex] = { ...state.tables[tableIndex], data };
            ctx.setState({
              ...state,
              tables
            });
          })
        )
      )
    );
  }
}
