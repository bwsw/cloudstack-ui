import { Routes } from '@angular/router';

import { LoginComponent } from './auth/login.component';
import { LogoutComponent } from './auth/logout.component';
import { HomeComponent } from './home/home.component';
import { sgRoutes } from './security-group/sg.routing';
import { SettingsComponent } from './settings/settings.component';
import { ReloadComponent } from './shared/components/reload/reload.component';
import { AuthGuard } from './shared/services/auth-guard.service';
import { LoginGuard } from './shared/services/login-guard.service';
import { volumeRoutes } from './volume/volume.routing';
import { sshRoutes } from './ssh-keys/ssh-keys.routing';
import { templateRouting } from './template/template.routing';
import { vmRoutes } from './vm/vm.routing';
import { EventListContainerComponent } from './events/containers/event-list.container';


export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [LoginGuard]
  },
  {
    path: 'logout',
    component: LogoutComponent
  },
  {
    path: 'reload',
    component: ReloadComponent
  },
  {
    path: '',
    component: HomeComponent,
    children: [
      ...vmRoutes,
      ...volumeRoutes,
      ...templateRouting,
      ...sgRoutes,
      {
        path: 'events',
        component: EventListContainerComponent,
        canActivate: [AuthGuard]
      },
      ...sshRoutes,
      {
        path: 'settings',
        component: SettingsComponent,
        canActivate: [AuthGuard]
      },
      {
        path: '**',
        redirectTo: 'instances'
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
