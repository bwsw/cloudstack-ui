import { Routes } from '@angular/router';
import { AuthGuard } from '../shared/services/auth-guard.service';
import { SecurityGroupCreationDialogComponent } from './sg-creation/security-group-creation-dialog.component';
import { SecurityGroupPageComponent } from './sg-page/security-group-page.component';
import { SecurityGroupRulesDialogComponent } from './sg-rules/sg-rules-dialog.component';

export const sgRoutes: Routes = [
  {
    path: 'security-group',
    component: SecurityGroupPageComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'create',
        component: SecurityGroupCreationDialogComponent
      }, {
        path: ':id',
        component: SecurityGroupRulesDialogComponent
      }
    ]
  }
];
