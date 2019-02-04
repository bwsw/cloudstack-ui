import { Routes } from '@angular/router';
import { AuthGuard } from '../shared/services/auth-guard.service';
import { ResourceQuotasContainerComponent } from './containers/resource-quotas.container';
import { ResourceQuotasEnabledGuard } from './resource-quotas-enabled-guard.service';

export const resourceQuotasRoutes: Routes = [
  {
    path: 'resource-quotas',
    component: ResourceQuotasContainerComponent,
    canActivate: [AuthGuard, ResourceQuotasEnabledGuard],
  },
];
