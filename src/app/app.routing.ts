import { RouterModule, Routes } from '@angular/router';

import { AuthGuard, LoginGuard } from './shared/services';
import { AboutComponent } from './about/about.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './auth/login.component';

import { VmListComponent } from './vm/vm-list.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/client',
    pathMatch: 'full'
  },
  {
    path: 'client',
    component: HomeComponent,
    canActivate: [
      AuthGuard
    ],
    children: [
      {
        path: 'about',
        component: AboutComponent,
      },
      {
        path: 'instances',
        component: VmListComponent,
      }
    ]
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [
      LoginGuard
    ]
  },
  {
    path: '**',
    redirectTo: '/client',
  }
];

export const routing = RouterModule.forRoot(routes);
