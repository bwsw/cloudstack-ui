import { Routes } from '@angular/router';

import { LoginComponent } from './auth/login.component';
import { RecurringSnapshotsComponent } from './snapshot/recurring-snapshots/recurring-snapshots.component';
import { LogoutComponent } from './auth/logout.component';
import { EventListComponent } from './events/event-list.component';
import { SgTemplateListComponent } from './security-group/sg-template-list/sg-template-list.component';
import { SettingsComponent } from './settings/settings.component';
import { AuthGuard, LoginGuard } from './shared/services';
import { SshKeysPageComponent } from './ssh-keys/ssh-keys-page.component';
import { ReloadComponent } from './shared/components/reload/reload.component';


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
    path: 'sg-templates',
    component: SgTemplateListComponent,
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
    path: 'test',
    component: RecurringSnapshotsComponent
  },
  {
    path: '**',
    redirectTo: 'instances'
  }
];
