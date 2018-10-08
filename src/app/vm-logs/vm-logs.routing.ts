import { Routes } from '@angular/router';
import { AuthGuard } from '../shared/services/auth-guard.service';
import { LogFilesComponent } from './log-files.component';
import { LogsComponent } from './logs.component';


export const vmLogsRoutes: Routes = [
  {
    path: 'log-files',
    component: LogFilesComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'logs',
    component: LogsComponent,
    canActivate: [AuthGuard],
  }
];
