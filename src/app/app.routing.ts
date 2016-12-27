import { RouterModule, Routes } from '@angular/router';

import { AuthGuard, LoginGuard } from './shared/services';
import { LoginComponent } from './auth/login.component';

import { VmListComponent } from './vm/vm-list.component';
import { SecurityGroupCreationComponent } from './security-group/security-group-creation.component';
import { asd } from './security-group/asd.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [
      LoginGuard
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
    path: 'sg',
    component: SecurityGroupCreationComponent,
    // component: asd,
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
