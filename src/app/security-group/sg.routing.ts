import { Routes } from '@angular/router';
import { AuthGuard } from '../shared/services/auth-guard.service';
import { SecurityGroupPageContainerComponent } from './containers/security-group-page.container';
import { SecurityGroupRulesDialogComponent } from './sg-rules/sg-rules-dialog.component';
import { SecurityGroupCreationDialogContainerComponent } from './containers/security-group-creation-dialog.container';

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
        component: SecurityGroupRulesDialogComponent
      }
    ]
  }
];
