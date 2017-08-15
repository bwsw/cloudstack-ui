import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../shared/services/auth-guard.service';
import { SettingsComponent } from './settings.component';

export const routes: Routes = [
  {
    path: '',
    component: SettingsComponent,
    canActivate: [AuthGuard]
  }
];

export const SettingsRouting = RouterModule.forChild(routes);
