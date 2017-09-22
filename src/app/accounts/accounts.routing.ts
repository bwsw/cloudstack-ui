import { Routes } from '@angular/router';
import { AuthGuard } from '../shared/services/auth-guard.service';

import { AccountPageComponent } from './account-page/account-page.component';

export const accountsRoutes: Routes = [
  {
    path: 'accounts',
    component: AccountPageComponent,
    canActivate: [AuthGuard]
  }
];
