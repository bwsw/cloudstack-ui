import { Routes } from '@angular/router';
import { AuthGuard } from '../shared/services/auth-guard.service';
import { AccountDetailsComponent } from './account-sidebar/account-details/account-details.component';
import { AccountPageContainerComponent } from './account-container/account.container';
import { AccountSidebarContainer } from './account-container/account-sidebar.container';

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
        component: AccountSidebarContainer,
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
