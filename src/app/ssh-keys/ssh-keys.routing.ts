import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../shared/services/auth-guard.service';
import { SshKeysPageComponent } from './ssh-keys-page.component';

const routes: Routes = [
  {
    path: '',
    component: SshKeysPageComponent,
    canActivate: [AuthGuard]
  }
];

export const SshKeysRouting = RouterModule.forChild(routes);
