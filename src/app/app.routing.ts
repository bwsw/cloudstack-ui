import { RouterModule, Routes } from '@angular/router';

import { AboutComponent } from './about/about.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './auth/login.component';

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
    ],
    children: [
      {
        path: 'about',
        component: AboutComponent,
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
