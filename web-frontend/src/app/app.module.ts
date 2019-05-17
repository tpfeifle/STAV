import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatButtonModule,
  MatChipsModule,
  MatDialogModule,
  MatInputModule, MatListModule,
  MatPaginatorModule,
  MatSidenavModule, MatSnackBarModule,
  MatSortModule,
  MatTableModule,
  MatToolbarModule,
  MatTooltipModule
} from '@angular/material';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { NgxsModule } from '@ngxs/store';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SheetState } from './shared/store/sheet/sheet.state';
import { MainState } from './shared/store/main/main.state';
import { SensorDataState } from './shared/store/sensor-data/sensor-data.state';
import { ReactiveFormsModule } from '@angular/forms';
import { ScriptManagerState } from './shared/store/script-manager/script-manager.state';
import { ProjectState } from './shared/store/project/project.state';
import { ProjectManagerComponent } from './project-manager/project-manager.component';
import { ProjectComponent } from './project/project.component';
import { SheetComponent } from './project/dashboard/sheet/sheet.component';
import { ScriptManagerCreateComponent } from './project/script-manager/script-create/script-manager-create.component';
import { ParserManagerComponent } from './project/parser-manager/parser-manager.component';
import { CronCreateComponent } from './project/script-manager/cron-create/cron-create.component';
import { ScriptManagerHistoryComponent } from './project/script-manager/script-history/script-manager-history.component';
import { ChartComponent } from './project/dashboard/sheet/chart/chart.component';
import { ChartEditorComponent } from './project/dashboard/sheet/chart-editor/chart-editor.component';
import { ScriptManagerListComponent } from './project/script-manager/script-list/script-manager-list.component';
import { CronListComponent } from './project/script-manager/cron-list/cron-list.component';
import { CreateDialogComponent, DashboardComponent } from './project/dashboard/dashboard.component';
import { ScriptManagerComponent } from './project/script-manager/script-manager.component';
import { ChartContainerComponent } from './project/dashboard/sheet/chart/chart.container';
import { HttpClientModule } from '@angular/common/http';
import { ParserCreateComponent } from './project/parser-manager/parser-create/parser-create.component';
import { ParserListComponent } from './project/parser-manager/parser-list/parser-list.component';
import { ParserState } from './shared/store/parser/parser.state';
import { PlotlyViaWindowModule } from 'angular-plotly.js';

@NgModule({
  declarations: [
    AppComponent,
    ChartEditorComponent,
    SheetComponent,
    ChartComponent,
    ChartContainerComponent,
    CreateDialogComponent,
    DashboardComponent,
    ScriptManagerComponent,
    ParserManagerComponent,
    ScriptManagerCreateComponent,
    ScriptManagerHistoryComponent,
    ScriptManagerListComponent,
    CronListComponent,
    CronCreateComponent,
    ProjectManagerComponent,
    ProjectComponent,
    ParserCreateComponent,
    ParserListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    MatTabsModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatToolbarModule,
    MatSidenavModule,
    MatChipsModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatTableModule,
    MatListModule,
    MatPaginatorModule,
    MatSortModule,
    MatTooltipModule,
    MatSnackBarModule,
    NgxsModule.forRoot([MainState, SheetState, SensorDataState, ScriptManagerState, ProjectState, ParserState]),
    AppRoutingModule,
    PlotlyViaWindowModule, // chart framework
    NgxsReduxDevtoolsPluginModule.forRoot()
    // NgxsLoggerPluginModule.forRoot()
  ],
  entryComponents: [CreateDialogComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}
