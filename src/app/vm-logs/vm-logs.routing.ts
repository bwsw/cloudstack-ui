import { Routes } from '@angular/router';
import { AuthGuard } from '../shared/services/auth-guard.service';
import { VmLogsContainerComponent } from './containers/vm-logs.container';
import { VmLogsEnabledGuard } from './vm-logs-enabled-guard.service';

export const vmLogsRoutes: Routes = [
  {
    path: 'logs',
    component: VmLogsContainerComponent,
    canActivate: [AuthGuard, VmLogsEnabledGuard],
  },
];
