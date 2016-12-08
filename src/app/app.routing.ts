import { RouterModule, Routes } from '@angular/router';

import { AboutComponent } from './about/about.component';
import { HomeComponent } from './home/home.component';
import { LoginFormComponent } from './login-form/login-form.component';

import { AuthGuard, LoginGuard } from './shared/services';

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
    ]
  },
  {
    path: 'client/about',
    component: AboutComponent,
    canActivate: [
      AuthGuard
    ]
  },
  {
    path: 'login',
    component: LoginFormComponent,
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
