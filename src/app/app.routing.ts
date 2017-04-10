import { Routes } from '@angular/router';

import { LoginComponent } from './auth/login.component';
import { SgTemplateListComponent } from './security-group/sg-template-list/sg-template-list.component';
import { TemplatePageComponent } from './template/template-page/template-page.component';
import { VmListComponent } from './vm/vm-list/vm-list.component';
import { EventListComponent } from './events/event-list.component';
import { SpareDrivePageComponent } from './spare-drive/spare-drive-page/spare-drive-page.component';
import { SettingsComponent } from './settings/settings.component';
import { AuthGuard } from './shared/services';
import { LoginGuard } from './shared/services';
import { SshKeysPageComponent } from './ssh-keys/ssh-keys-page.component';
import { LogoutComponent } from './auth/logout.component';


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
    path: 'sg-templates',
    component: SgTemplateListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'instances',
    component: VmListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'templates',
    component: TemplatePageComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'spare-drives',
    component: SpareDrivePageComponent,
    canActivate: [AuthGuard]
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
    path: 'ssh-keys',
    component: SshKeysPageComponent,
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: '/instances'
  }
];
