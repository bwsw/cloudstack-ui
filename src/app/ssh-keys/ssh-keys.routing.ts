import { Routes } from '@angular/router';
import { AuthGuard } from '../shared/services/auth-guard.service';
import { SshKeyCreationComponent } from './ssh-key-creation/ssh-key-creation.component';
import { SshKeySidebarComponent } from './ssh-key-sidebar/ssh-key-sidebar.component';
import { SshKeyPageContainerComponent } from './containers/ssh-key-page/ssh-key-page.container';

export const sshRoutes: Routes = [
  {
    path: 'ssh-keys',
    component: SshKeyPageContainerComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'create',
        component: SshKeyCreationComponent,
      },
      {
        path: 'view/:id',
        component: SshKeySidebarComponent,
        canActivate: [AuthGuard],
      },
    ],
  },
];
