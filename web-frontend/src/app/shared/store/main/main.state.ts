import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { CreateSheet, DeleteSheet, GetSheetList, SetProject } from './main.actions';
import { HttpClient } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { MainStateModel, SheetSimple } from '../../models/main.model';
import { environment } from '../../../../environments/environment';

@State<MainStateModel>({
  name: 'main',
  defaults: {
    sheets: [],
    chartTemplates: [],
    project: null
  }
})
export class MainState {
  constructor(private http: HttpClient, private store: Store) {}

  @Selector()
  static getSheets(state: MainStateModel) {
    return state.sheets.sort((a: SheetSimple, b: SheetSimple) => a.id - b.id);
  }

  @Selector()
  static chartTemplates(state: MainStateModel) {
    return state.chartTemplates;
  }

  @Selector()
  static project(state: MainStateModel) {
    return state.project;
  }

  @Action(SetProject)
  setProject(ctx: StateContext<MainStateModel>, { project }: SetProject) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      project,
      sheets: []
    });
  }

  @Action(GetSheetList)
  getSheetList(ctx: StateContext<MainStateModel>, {  }: GetSheetList) {
    return this.http.get(`${environment.apiUrl}/project/${ctx.getState().project}/sheet`).pipe(
      tap((sheets: SheetSimple[]) => {
        const state = ctx.getState();
        ctx.setState({
          ...state,
          sheets
        });
      }),
      catchError(error => {
        throw error;
      })
    );
  }

  @Action(CreateSheet)
  createSheet(ctx: StateContext<MainStateModel>, { name }: CreateSheet) {
    return this.http.post(`${environment.apiUrl}/project/${ctx.getState().project}/sheet`, { name }).pipe(
      tap((sheet: SheetSimple) => {
        const state = ctx.getState();
        ctx.setState({
          ...state,
          sheets: state.sheets.concat(sheet)
        });
      }),
      catchError(error => {
        throw error;
      })
    );
  }

  @Action(DeleteSheet)
  removeSheet(ctx: StateContext<MainStateModel>, { sheetId }: DeleteSheet) {
    return this.http.delete(`${environment.apiUrl}/project/${ctx.getState().project}/sheet/${sheetId}`).pipe(
      tap(() => {
        const state = ctx.getState();
        ctx.setState({
          ...state,
          sheets: [...state.sheets.filter(sheet => sheet.id !== sheetId)]
        });
      }),
      catchError(error => {
        throw error;
      })
    );
  }
}
