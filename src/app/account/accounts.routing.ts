import { Routes } from '@angular/router';
import { AuthGuard } from '../shared/services/auth-guard.service';
import { AccountDetailsContainerComponent } from './account-container/account-details.container';
import { AccountSidebarContainerComponent } from './account-container/account-sidebar.container';
import { AccountUsersContainerComponent } from './account-container/account-users.container';
import { AccountPageContainerComponent } from './account-container/account.container';
import { AccountCreationComponent } from './creation-form/account-creation.component';

export const accountsRoutes: Routes = [
  {
    path: 'accounts',
    component: AccountPageContainerComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'create',
        component: AccountCreationComponent,
      },
      {
        path: ':id',
        component: AccountSidebarContainerComponent,
        canActivate: [AuthGuard],
        children: [
          {
            path: '',
            redirectTo: 'account',
            pathMatch: 'full',
          },
          {
            path: 'account',
            component: AccountDetailsContainerComponent,
          },
          {
            path: 'users',
            component: AccountUsersContainerComponent,
          },
        ],
      },
    ],
  },
];
