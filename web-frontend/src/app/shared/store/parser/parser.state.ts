import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { ClearParserData, CreateParser, DeleteParser, GetParserList } from './parser.actions';
import { Parser, ParserStateModel } from '../../models/parser.model';
import { HttpClient } from '@angular/common/http';
import { switchMap, tap } from 'rxjs/operators';
import { MainState } from '../main/main.state';
import { environment } from '../../../../environments/environment';

@State<ParserStateModel>({
  name: 'parser',
  defaults: {
    parsers: []
  }
})
export class ParserState {
  constructor(private http: HttpClient, private store: Store) {}

  @Selector()
  static parsers(state: ParserStateModel) {
    return state.parsers;
  }

  @Action(CreateParser)
  add(ctx: StateContext<ParserStateModel>, { formData }: CreateParser) {
    return this.store.select(MainState.project).pipe(
      switchMap(projectId =>
        this.http.post<Parser>(`${environment.apiUrl}/project/${projectId}/parser-manager`, formData).pipe(
          tap((createdParser: Parser) => {
            const state = ctx.getState();
            ctx.setState({
              ...state,
              parsers: state.parsers.concat(createdParser)
            });
          })
        )
      )
    );
  }

  @Action(GetParserList)
  getParserList(ctx: StateContext<ParserStateModel>) {
    return this.store.select(MainState.project).pipe(
      switchMap(projectId =>
        this.http.get<Parser[]>(`${environment.apiUrl}/project/${projectId}/parser-manager`).pipe(
          tap((parsers: Parser[]) => {
            const state = ctx.getState();
            ctx.setState({
              ...state,
              parsers
            });
          })
        )
      )
    );
  }

  @Action(DeleteParser)
  remove(ctx: StateContext<ParserStateModel>, { parserId }: DeleteParser) {
    return this.store.select(MainState.project).pipe(
      switchMap(projectId =>
        this.http.delete<Error>(`${environment.apiUrl}/project/${projectId}/parser-manager/${parserId}`).pipe(
          tap((error: Error) => {
            const state = ctx.getState();
            ctx.setState({
              ...state,
              parsers: state.parsers.filter(parser => parser.id !== parserId)
            });
          })
        )
      )
    );
  }

  @Action(ClearParserData)
  clearData(ctx: StateContext<ParserStateModel>, { parserId }: ClearParserData) {
    return this.store
      .select(MainState.project)
      .pipe(
        switchMap(projectId =>
          this.http.get(`${environment.apiUrl}/project/${projectId}/parser-manager/${parserId}/clear`)
        )
      );
  }
}
