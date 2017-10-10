import { Routes } from '@angular/router';
import { AuthGuard } from '../shared/services/auth-guard.service';
import { AccountSidebarComponent } from './account-sidebar/account-sidebar.component';
import { AccountDetailsComponent } from './account-sidebar/account-details/account-details.component';
import { AccountPageContainerComponent } from './account-container/account.container';

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
