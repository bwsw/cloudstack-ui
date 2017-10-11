import { Routes } from '@angular/router';
import { AuthGuard } from '../shared/services/auth-guard.service';
import { SshKeyCreationComponent } from './ssh-key-creation/ssh-key-creation.component';
import { SshKeySidebarComponent } from './ssh-key-sidebar/ssh-key-sidebar.component';
import { SshKeyListContainerComponent } from './containers/ssh-key-list.container';


export const sshRoutes: Routes = [
  {
    path: 'ssh-keys',
    component: SshKeyListContainerComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'create',
        component: SshKeyCreationComponent
      },
      {
        path: ':id',
        component: SshKeySidebarComponent,
        canActivate: [AuthGuard]
      }
    ]
  }
];
