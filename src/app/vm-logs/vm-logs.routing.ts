import { Routes } from '@angular/router';
import { AuthGuard } from '../shared/services/auth-guard.service';
import { VmLogsComponent } from './vm-logs/vm-logs.component';
import { VmLogsEnabledGuard } from './vm-logs-enabled-guard.service';

export const vmLogsRoutes: Routes = [
  {
    path: 'logs',
    component: VmLogsComponent,
    canActivate: [AuthGuard, VmLogsEnabledGuard],
  },
];
