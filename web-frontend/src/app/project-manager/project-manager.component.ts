import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { ProjectState } from '../shared/store/project/project.state';
import { Observable } from 'rxjs';
import { Project } from '../shared/models/project.model';
import { CreateProject, DeleteProject, GetAllProjects } from '../shared/store/project/project.actions';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-project-manager',
  templateUrl: './project-manager.component.html',
  styleUrls: ['./project-manager.component.scss']
})
export class ProjectManagerComponent implements OnInit {
  @Select(ProjectState.projects)
  projects$: Observable<Project[]>;

  backLinkProject$: Observable<string>;
  createForm: FormGroup;

  displayedColumns: string[] = ['id', 'name', 'action'];

  constructor(private readonly store: Store, private readonly fb: FormBuilder) {
    this.store.dispatch(new GetAllProjects());
    this.backLinkProject$ = this.projects$.pipe(
      map(projects => {
        if (projects.length > 0) {
          return String(projects[0].id);
        } else {
          return '';
        }
      })
    );
  }

  ngOnInit() {
    this.createForm = this.fb.group({
      name: ['', Validators.required]
    });
  }

  createProject() {
    console.log('create');
    const newProject = new Project(null, this.createForm.value.name);
    this.store.dispatch(new CreateProject(newProject));
  }

  deleteProject(project: Project) {
    if (
      confirm(
        'Do not delete! This also deletes all related scripts, dashboards, charts, cronjobs, ... Are you REALLY sure?'
      )
    ) {
      this.store.dispatch(new DeleteProject(project.id));
    }
  }
}
