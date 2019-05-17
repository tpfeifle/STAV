import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { ProjectState } from '../shared/store/project/project.state';
import { combineLatest, Observable, Subject } from 'rxjs';
import { Project } from '../shared/models/project.model';
import { GetAllProjects } from '../shared/store/project/project.actions';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { map, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit, OnDestroy {
  @Select(ProjectState.projects)
  projects$: Observable<Project[]>;

  activeProject: Project;
  componentDies$ = new Subject();
  ngOnInit() {}

  constructor(private store: Store, private route: ActivatedRoute, private router: Router) {
    this.store.dispatch(new GetAllProjects());

    const $combined = combineLatest(this.route.paramMap, this.projects$);
    $combined
      .pipe(
        takeUntil(this.componentDies$),
        map(results => {
          const params: ParamMap = results[0];
          const projects: Project[] = results[1];
          if (projects.length > 0) {
            const projectId: number = Number(params.get('id'));

            this.activeProject = projects.find((project: Project) => project.id === projectId);
          }
        })
      )
      .subscribe();
  }

  navigateTo(projectId: number) {
    if (projectId) {
      this.router.navigateByUrl(`/project/${projectId}`);
    }
    return false;
  }

  ngOnDestroy(): void {
    this.componentDies$.complete();
  }
}
