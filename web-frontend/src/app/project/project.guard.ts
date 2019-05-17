import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngxs/store';
import { SetProject } from '../shared/store/main/main.actions';
import { MainState } from '../shared/store/main/main.state';
import { filter, map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProjectGuard implements CanActivate {
  constructor(private store: Store, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    if (state.url.indexOf('dashboard') > -1 || state.url.indexOf('parser-manager') > -1 || state.url.indexOf('script-manager') > -1) {
      const projectId = Number(route.paramMap.get('id'));

      this.store.dispatch(new SetProject(projectId));
      console.log(state.url);
      console.log(projectId);

      return this.store.select(MainState.project).pipe(
        filter((storeProjectId: number) => storeProjectId === projectId),
        map(() => true),
        take(1)
      );
    } else {
      console.log('redirecting');
      this.router.navigate([state.url + '/dashboard']);
    }
  }
}
