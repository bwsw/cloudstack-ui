import { Routes } from '@angular/router';
import { AuthGuard } from '../shared/services/auth-guard.service';
import { SecurityGroupCreationDialogComponent } from './sg-creation/security-group-creation-dialog.component';
import { SecurityGroupPageContainerComponent } from './sg-page/containers/security-group-page.container';
import { SecurityGroupRulesDialogContainerComponent } from './sg-rules/containers/sg-rules-dialog.container';

export const sgRoutes: Routes = [
  {
    path: 'security-group',
    component: SecurityGroupPageContainerComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'create',
        component: SecurityGroupCreationDialogComponent
      }, {
        path: ':id',
        component: SecurityGroupRulesDialogContainerComponent
      }
    ]
  }
];
