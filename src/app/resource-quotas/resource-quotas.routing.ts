import { Routes } from '@angular/router';
import { AuthGuard } from '../shared/services/auth-guard.service';
import { ResourceQuotasContainerComponent } from './containers/resource-quotas/resource-quotas.container';

export const resourceQuotasRoutes: Routes = [
  {
    path: 'resource-quotas',
    component: ResourceQuotasContainerComponent,
    canActivate: [AuthGuard],
  },
];
