import { Routes } from '@angular/router';
import { AuthGuard } from '../shared/services/auth-guard.service';
import { SecurityGroupPageContainerComponent } from './containers/security-group-page.container';
import { SecurityGroupCreationDialogContainerComponent } from './containers/security-group-creation-dialog.container';
import { SecurityGroupSidebarContainerComponent } from './containers/security-group-sidebar.container';

export const sgRoutes: Routes = [
  {
    path: 'security-group',
    component: SecurityGroupPageContainerComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'create',
        component: SecurityGroupCreationDialogContainerComponent
      }, {
        path: ':id',
        children: [
          {
            path: '',
            redirectTo: 'details',
            pathMatch: 'full'
          },
          {
            path: 'details',
            component: SecurityGroupSidebarContainerComponent
          }
        ]
      }
    ]
  }
];
