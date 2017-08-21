import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../shared/services/auth-guard.service';
import { SpareDrivePageComponent } from './spare-drive-page/spare-drive-page.component';
import { SpareDriveSidebarComponent } from './spare-drive-sidebar/spare-drive-sidebar.component';

const routes: Routes = [
  {
    path: 'spare-drives',
    component: SpareDrivePageComponent,
    canActivate: [AuthGuard],
    children: [{
      path: ':id',
      component: SpareDriveSidebarComponent,
      canActivate: [AuthGuard]
    }]
  }
];

export const spareDrivesRouting = RouterModule.forChild(routes);
