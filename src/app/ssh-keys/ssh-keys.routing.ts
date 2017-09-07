import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../shared/services/auth-guard.service';
import { SshKeysPageComponent } from './ssh-keys-page/ssh-keys-page.component';
import { SshKeyCreationComponent } from './ssh-key-creation/ssh-key-creation.component';
import { SshKeySidebarComponent } from './ssh-key-sidebar/ssh-key-sidebar.component';


const routes: Routes = [
  {
    path: 'ssh-keys',
    component: SshKeysPageComponent,
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

export const sshKeysRouting = RouterModule.forChild(routes);
