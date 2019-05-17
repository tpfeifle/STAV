import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngxs/store';
import { MainState } from '../../../shared/store/main/main.state';

@Injectable({
  providedIn: 'root'
})
export class SheetGuard implements CanActivate {
  constructor(private readonly router: Router, private readonly store: Store) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const defaultSheet = this.store.selectSnapshot(MainState.getSheets)[0];
    const project = this.store.selectSnapshot(MainState.project);
    this.router.navigate([`/project/${project}/dashboard/${defaultSheet.id}`]);
    // this.router.navigateByUrl(`/project/${project}/dashboard/${defaultSheet.id}`);
    return true;
  }
}
