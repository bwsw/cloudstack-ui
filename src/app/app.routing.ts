import { RouterModule, Routes } from '@angular/router';

import { AuthGuard, LoginGuard } from './shared/services';
import { LoginComponent } from './auth/login.component';

import { VmCreateComponent } from './vm/vm-create.component';
import { VmListComponent } from './vm/vm-list.component';
import { SecurityGroupTemplateListComponent } from './security-group/security-group-template-list.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [
      LoginGuard
    ]
  },
  {
    path: 'sg-templates',
    component: SecurityGroupTemplateListComponent,
    canActivate: [
      AuthGuard
    ]
  },
  {
    path: 'instances',
    component: VmListComponent,
    canActivate: [
      AuthGuard
    ]
  },
  {
    path: '**',
    redirectTo: '/instances',
  }
];

export const routing = RouterModule.forRoot(routes);
