import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { vmRoutes } from './vm/vm.routing';
import { AuthGuard } from './shared/services/auth-guard.service';
import { sgRoutes } from './security-group/sg.routing';
import { LogoutComponent } from './auth/logout.component';
import { templateRouting } from './template/template.routing';
import { ReloadComponent } from './shared/components/reload/reload.component';
import { snapshotRoutes } from './snapshot/snapshot.routing';
import { SettingsComponent } from './settings/containers';
import { EventListContainerComponent } from './events/containers/event-list.container';
import { sshRoutes } from './ssh-keys/ssh-keys.routing';
import { volumeRoutes } from './volume/volume.routing';
import { accountsRoutes } from './account/accounts.routing';
import { HomeComponent } from './home/home.component';
import { LoginGuard } from './shared/services/login-guard.service';
import { LoginComponent } from './auth/login.component';
import { vmLogsRoutes } from './vm-logs/vm-logs.routing';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [LoginGuard],
  },
  {
    path: 'logout',
    component: LogoutComponent,
  },
  {
    path: 'reload',
    component: ReloadComponent,
  },
  {
    path: '',
    component: HomeComponent,
    children: [
      ...vmRoutes,
      ...volumeRoutes,
      ...templateRouting,
      ...snapshotRoutes,
      ...sgRoutes,
      ...accountsRoutes,
      {
        path: 'events',
        component: EventListContainerComponent,
        canActivate: [AuthGuard],
      },
      ...sshRoutes,
      ...vmLogsRoutes,
      {
        path: 'settings',
        component: SettingsComponent,
        canActivate: [AuthGuard],
      },
      {
        path: '**',
        redirectTo: 'instances',
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
