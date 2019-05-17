import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable, of } from 'rxjs';
import { filter, map, take, tap } from 'rxjs/operators';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { GetSheetList } from '../../shared/store/main/main.actions';
import { MainState } from '../../shared/store/main/main.state';

@Injectable({
  providedIn: 'root'
})
export class DashboardGuard implements CanActivate {
  constructor(private store: Store) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    this.store.dispatch(new GetSheetList());
    return this.store.select(MainState.getSheets).pipe(
      filter(sheets => sheets.length > 0),
      map(() => true),
      take(1)
    );
  }
}
