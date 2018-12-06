import { Routes } from '@angular/router';
import { AuthGuard } from '../shared/services/auth-guard.service';
import { ResourceQuotasComponent } from './components/resource-quotas/resource-quotas.component';

export const resourceQuotasRoutes: Routes = [
  {
    path: 'resource-quotas',
    component: ResourceQuotasComponent,
    canActivate: [AuthGuard],
  },
];
