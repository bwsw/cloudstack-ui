import { Routes } from '@angular/router';
import { AuthGuard } from '../shared/services/auth-guard.service';
import { SecurityGroupPageContainerComponent } from './containers/security-group-page.container';
import { SecurityGroupSidebarContainerComponent } from './containers/security-group-sidebar.container';
import { SecurityGroupCreationDialogComponent } from './sg-creation/security-group-creation-dialog.component';
import { SecurityGroupRulesDialogComponent } from './sg-rules/sg-rules-dialog.component';
import { SecurityGroupDetailsContainerComponent } from './containers/security-group-details.container';
import { SecurityGroupTagsContainerComponent } from './containers/sg-tags.container';

export const sgRoutes: Routes = [
  {
    path: 'security-group',
    component: SecurityGroupPageContainerComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'create',
        component: SecurityGroupCreationDialogComponent,
      },
      {
        path: ':id',
        children: [
          {
            path: '',
            redirectTo: 'details',
            pathMatch: 'full',
          },
          {
            path: 'details',
            component: SecurityGroupSidebarContainerComponent,
            canActivate: [AuthGuard],
            children: [
              {
                path: '',
                redirectTo: 'sg',
                pathMatch: 'full',
              },
              {
                path: 'sg',
                component: SecurityGroupDetailsContainerComponent,
              },
              {
                path: 'tags',
                component: SecurityGroupTagsContainerComponent,
              },
            ],
          },
          {
            path: 'rules',
            component: SecurityGroupRulesDialogComponent,
          },
        ],
      },
    ],
  },
];
