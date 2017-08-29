import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../shared/services/auth-guard.service';
import { SpareDrivePageComponent } from './spare-drive-page/spare-drive-page.component';
import { SpareDriveSidebarComponent } from './spare-drive-sidebar/spare-drive-sidebar.component';
import { SpareDriveCreationDialogComponent } from './spare-drive-creation/spare-drive-creation-dialog.component';

const routes: Routes = [
  {
    path: 'storage',
    component: SpareDrivePageComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'create',
        component: SpareDriveCreationDialogComponent
      }, {
        path: ':id',
        component: SpareDriveSidebarComponent,
        canActivate: [AuthGuard]
      }
    ]
  }
];

export const spareDrivesRouting = RouterModule.forChild(routes);
