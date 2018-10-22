import { Routes } from '@angular/router';
import { AuthGuard } from '../shared/services/auth-guard.service';
import { VmLogsContainerComponent } from './containers/vm-logs.container';


export const vmLogsRoutes: Routes = [
  {
    path: 'logs',
    component: VmLogsContainerComponent,
    canActivate: [AuthGuard],
  }
];
