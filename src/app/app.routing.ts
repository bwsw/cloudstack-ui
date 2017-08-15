import { Routes } from '@angular/router';

import { LoginComponent } from './auth/login.component';
import { LogoutComponent } from './auth/logout.component';
import { ReloadComponent } from './shared/components/reload/reload.component';
import { LoginGuard } from './shared/services';


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
    path: 'spare-drives',
    loadChildren: './spare-drive/spare-drive.module#SpareDriveModule'
  },
  {
    path: 'sg-templates',
    loadChildren: './security-group/sg.module#SecurityGroupModule'
  },
  {
    path: 'events',
    loadChildren: './events/events.module#EventsModule'
  },
  {
    path: 'settings',
    loadChildren: './settings/settings.module#SettingsModule'
  },
  {
    path: 'ssh-keys',
    loadChildren: './ssh-keys/ssh-keys.module#SshKeysModule'
  },
  {
    path: '**',
    redirectTo: 'instances'
  }
];
