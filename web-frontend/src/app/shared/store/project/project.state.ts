import { Action, Selector, State, StateContext } from '@ngxs/store';
import { CreateProject, DeleteProject, GetAllProjects } from './project.actions';
import { Project, ProjectStateModel } from '../../models/project.model';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

@State<ProjectStateModel>({
  name: 'project',
  defaults: {
    projects: []
  }
})
export class ProjectState {
  constructor(private http: HttpClient) {}

  @Selector()
  static projects(state: ProjectStateModel) {
    return state.projects;
  }

  @Action(CreateProject)
  createProject(ctx: StateContext<ProjectStateModel>, { project }: CreateProject) {
    return this.http.post<Project>(`${environment.apiUrl}/project`, project).pipe(
      tap((createdProject: Project) => {
        const state = ctx.getState();
        ctx.setState({
          ...state,
          projects: state.projects.concat(createdProject)
        });
      })
    );
  }

  @Action(GetAllProjects)
  getAllProjects(ctx: StateContext<ProjectStateModel>) {
    return this.http.get<Project[]>(`${environment.apiUrl}/project`).pipe(
      tap((projects: Project[]) => {
        const state = ctx.getState();
        ctx.setState({
          ...state,
          projects
        });
      })
    );
  }

  @Action(DeleteProject)
  deleteProject(ctx: StateContext<ProjectStateModel>, { projectId }: DeleteProject) {
    return this.http.delete<Error>(`${environment.apiUrl}/project/${projectId}`).pipe(
      tap((error: Error) => {
        if (!error) {
          const state = ctx.getState();
          ctx.setState({
            ...state,
            projects: state.projects.filter(project => project.id !== projectId)
          });
        }
      })
    );
  }
}
