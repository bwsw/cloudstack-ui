import { Routes } from '@angular/router';

import { LoginComponent } from './auth/login.component';
import { LogoutComponent } from './auth/logout.component';
import { EventListComponent } from './events/event-list.component';
import { SettingsComponent } from './settings/settings.component';
import { ReloadComponent } from './shared/components/reload/reload.component';
import { AuthGuard } from './shared/services/auth-guard.service';
import { LoginGuard } from './shared/services/login-guard.service';


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
    path: 'events',
    component: EventListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'settings',
    component: SettingsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: 'instances'
  }
];
