import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../shared/services/auth-guard.service';
import { SshKeysPageComponent } from './ssh-keys-page.component';
import { SshKeyCreationComponent } from './ssh-key-creation/ssh-key-creation.component';

const routes: Routes = [
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

export const sshKeysRouting = RouterModule.forChild(routes);
