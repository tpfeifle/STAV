import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectManagerComponent } from './project-manager/project-manager.component';
import { ProjectComponent } from './project/project.component';
import { ScriptManagerComponent } from './project/script-manager/script-manager.component';
import { ParserManagerComponent } from './project/parser-manager/parser-manager.component';
import { DashboardComponent } from './project/dashboard/dashboard.component';
import { DashboardGuard } from './project/dashboard/dashboard.guard';
import { SheetComponent } from './project/dashboard/sheet/sheet.component';
import { SheetGuard } from './project/dashboard/sheet/sheet.guard';
import { ProjectGuard } from './project/project.guard';

const routes: Routes = [
  {
    path: 'project/:id',
    component: ProjectComponent,
    canActivate: [ProjectGuard],
    children: [
      { path: 'script-manager', component: ScriptManagerComponent },
      { path: 'parser-manager', component: ParserManagerComponent },
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [DashboardGuard],
        children: [
          {
            path: ':id',
            component: SheetComponent
          },
          { path: '', pathMatch: 'full', children: [], canActivate: [SheetGuard] }
        ]
      }
    ]
  },
  { path: 'project-manager', component: ProjectManagerComponent },
  { path: '', redirectTo: 'project-manager', pathMatch: 'full' },
  { path: '**', redirectTo: 'project-manager' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)], //{ enableTracing: true }
  exports: [RouterModule]
})
export class AppRoutingModule {}
