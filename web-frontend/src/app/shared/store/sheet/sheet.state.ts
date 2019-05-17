import { State, Action, StateContext, Selector, Store } from '@ngxs/store';
import {
  AddChart,
  RemoveChart,
  GetSheet,
  OpenChart,
  UpdateChart,
  UpdateChartParameters,
  CloseChartEditor
} from './sheet.actions';
import { Chart } from '../../models/chart.model';
import { HttpClient } from '@angular/common/http';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { SheetStateModel } from '../../models/sheet.model';
import { MainState } from '../main/main.state';
import { environment } from '../../../../environments/environment';

@State<SheetStateModel>({
  name: 'sheet',
  defaults: {
    id: null,
    name: '',
    charts: [],
    editorChartId: null
  }
})
export class SheetState {
  constructor(private http: HttpClient, private store: Store) {}

  @Selector()
  static getCharts(state: SheetStateModel) {
    return state.charts;
  }

  @Action(GetSheet)
  getSheet(ctx: StateContext<SheetStateModel>, { sheetId }: GetSheet) {
    return this.store.select(MainState.project).pipe(
      switchMap(projectId =>
        this.http.get<SheetStateModel>(`${environment.apiUrl}/project/${projectId}/sheet/${sheetId}`).pipe(
          tap(sheet => {
            ctx.setState({
              ...sheet
            });
          }),
          catchError(error => {
            throw error;
          })
        )
      )
    );
  }

  @Action(AddChart)
  addChart(ctx: StateContext<SheetStateModel>, { newChart }: AddChart) {
    return this.store.select(MainState.project).pipe(
      switchMap(projectId =>
        this.http
          .post<Chart>(`${environment.apiUrl}/project/${projectId}/sheet/${ctx.getState().id}/chart`, newChart)
          .pipe(
            tap(chart => {
              const state = ctx.getState();
              ctx.setState({
                ...state,
                charts: [...state.charts.concat(chart)]
              });
            }),
            catchError(error => {
              throw error;
            })
          )
      )
    );
  }

  @Action(UpdateChart)
  updateChart(ctx: StateContext<SheetStateModel>, { chart, chartParameters }: UpdateChart) {
    const state = ctx.getState();

    const chartIndex = state.charts.findIndex(stateChart => stateChart.id === chart.id);

    state.charts[chartIndex] = Object.assign({}, chart);
    Object.entries(chartParameters).forEach(([key, value]: [string, string]) => {
      const stateChartParamIndex = state.charts[chartIndex].parameters.findIndex(
        stateChartParam => stateChartParam.templateParameter === key
      );
      state.charts[chartIndex].parameters[stateChartParamIndex].assignedField = value;
    });

    ctx.setState(state);

    return this.store.select(MainState.project).pipe(
      switchMap(projectId =>
        this.http
          .put<Chart>(
            `${environment.apiUrl}/project/${projectId}/sheet/${ctx.getState().id}/chart`,
            state.charts[chartIndex]
          )
          .pipe(
            catchError(error => {
              throw error;
            })
          )
      )
    );
  }

  @Action(UpdateChartParameters)
  updateChartParameters(ctx: StateContext<SheetStateModel>, { chartId, chartParameters }: UpdateChartParameters) {
    const state = ctx.getState();

    const chartIndex = state.charts.findIndex(chart => chart.id === chartId);
    Object.entries(chartParameters).forEach(([key, value]: [string, string]) => {
      const stateChartParamIndex = state.charts[chartIndex].parameters.findIndex(
        stateChartParam => stateChartParam.templateParameter === key
      );
      state.charts[chartIndex].parameters[stateChartParamIndex].assignedField = value;
    });

    ctx.setState({
      ...state,
      charts: [...state.charts]
    });
    return this.store.select(MainState.project).pipe(
      switchMap(projectId =>
        this.http
          .put<Chart>(
            `${environment.apiUrl}/project/${projectId}/sheet/${ctx.getState().id}/chart`,
            state.charts[chartIndex]
          )
          .pipe(
            catchError(error => {
              throw error;
            })
          )
      )
    );
  }

  @Action(RemoveChart)
  deleteComponent(ctx: StateContext<SheetStateModel>, { chartId }: RemoveChart) {
    return this.store.select(MainState.project).pipe(
      switchMap(projectId =>
        this.http.delete(`${environment.apiUrl}/project/${projectId}/sheet/${ctx.getState().id}/chart/${chartId}`).pipe(
          tap(() => {
            const state = ctx.getState();
            ctx.setState({
              ...state,
              charts: [...state.charts.filter(chart => chart.id !== chartId)]
            });
          }),
          catchError(error => {
            throw error;
          })
        )
      )
    );
  }

  @Action(OpenChart)
  openChart(ctx: StateContext<SheetStateModel>, { chartId }: OpenChart) {
    const state = ctx.getState();
    ctx.setState({ ...state, editorChartId: chartId });
  }

  @Action(CloseChartEditor)
  closeChartEditor(ctx: StateContext<SheetStateModel>, {  }: CloseChartEditor) {
    const state = ctx.getState();
    ctx.setState({ ...state, editorChartId: null });
  }

  @Selector([SheetState])
  static getChartToEdit(state: SheetStateModel) {
    return state.charts.filter(chart => chart.id === state.editorChartId)[0];
  }
}
