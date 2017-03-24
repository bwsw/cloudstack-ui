import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './auth/login.component';
import { SgTemplateListComponent } from './security-group/sg-template-list/sg-template-list.component';
import { TemplatePageComponent } from './template/template-page/template-page.component';
import { VmListComponent } from './vm/vm-list/vm-list.component';
import { EventListComponent } from './events/event-list.component';
import { SpareDrivePageComponent } from './spare-drive/spare-drive-page/spare-drive-page.component';
import { SettingsComponent } from './settings/settings.component';
import { AuthGuard } from './shared/services/auth-guard.service';
import { LoginGuard } from './shared/services/login-guard.service';
import { SshKeysPageComponent } from './ssh-keys/ssh-keys-page.component';


const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [LoginGuard]
  },
  {
    path: 'sg-templates',
    component: SgTemplateListComponent
  },
  {
    path: 'instances',
    component: VmListComponent
  },
  {
    path: 'templates',
    component: TemplatePageComponent
  },
  {
    path: 'spare-drives',
    component: SpareDrivePageComponent
  },
  {
    path: 'events',
    component: EventListComponent
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

export const routing = RouterModule.forRoot(routes);
