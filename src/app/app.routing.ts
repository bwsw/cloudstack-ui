import { Routes } from '@angular/router';

import { LoginComponent } from './auth/login.component';
import { LogoutComponent } from './auth/logout.component';
import { EventListComponent } from './events/event-list.component';
import { HomeComponent } from './home/home.component';
import { sgRoutes } from './security-group/sg.routing';
import { SettingsComponent } from './settings/settings.component';
import { ReloadComponent } from './shared/components/reload/reload.component';
import { AuthGuard } from './shared/services/auth-guard.service';
import { LoginGuard } from './shared/services/login-guard.service';
import { spareDriveRoutes } from './volume/volume.routing';
import { sshRoutes } from './ssh-keys/ssh-keys.routing';
import { templateRouting } from './template/template.routing';
import { vmRoutes } from './vm/vm.routing';


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
      ...spareDriveRoutes,
      ...templateRouting,
      ...sgRoutes,
      {
        path: 'events',
        component: EventListComponent,
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
