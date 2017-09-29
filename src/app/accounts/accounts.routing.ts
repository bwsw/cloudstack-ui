import { Routes } from '@angular/router';
import { AuthGuard } from '../shared/services/auth-guard.service';

import { AccountPageComponent } from './account-page/account-page.component';
import { AccountSidebarComponent } from './account-sidebar/account-sidebar.component';
import { AccountDetailsComponent } from './account-sidebar/account-details/account-details.component';

export const accountsRoutes: Routes = [
  {
    path: 'accounts',
    component: AccountPageComponent,
    canActivate: [AuthGuard],
    children: [
      /*{
        path: 'create',
        component: AccountCreationDialogComponent
      },*/ {
        path: ':id',
        component: AccountSidebarComponent,
        canActivate: [AuthGuard],
        children: [
          {
            path: '',
            redirectTo: 'account',
            pathMatch: 'full'
          },
          {
            path: 'account',
            component: AccountDetailsComponent
          },
        ]
      }
    ]
  }
];
