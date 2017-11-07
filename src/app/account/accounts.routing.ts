import { Routes } from '@angular/router';
import { AuthGuard } from '../shared/services/auth-guard.service';
import { AccountPageContainerComponent } from './account-container/account.container';
import { AccountSidebarContainerComponent } from './account-container/account-sidebar.container';
import { AccountDetailsContainerComponent } from './account-container/account-details.container';

export const accountsRoutes: Routes = [
  {
    path: 'accounts',
    component: AccountPageContainerComponent,
    canActivate: [AuthGuard],
    children: [
      /*{
        path: 'create',
        component: AccountCreationDialogComponent
      },*/ {
        path: ':id',
        component: AccountSidebarContainerComponent,
        canActivate: [AuthGuard],
        children: [
          {
            path: '',
            redirectTo: 'account',
            pathMatch: 'full'
          },
          {
            path: 'account',
            component: AccountDetailsContainerComponent
          },
        ]
      }
    ]
  }
];
