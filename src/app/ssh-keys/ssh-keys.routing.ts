import { Routes } from '@angular/router';
import { AuthGuard } from '../shared/services/auth-guard.service';
import { SshKeyCreationComponent } from './ssh-key-creation/ssh-key-creation.component';
import { SshKeysPageComponent } from './ssh-keys-page.component';

export const sshRoutes: Routes = [
  {
    path: 'ssh-keys',
    component: SshKeysPageComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'create',
        component: SshKeyCreationComponent
      }
    ]
  }
];
