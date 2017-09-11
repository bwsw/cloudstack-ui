import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../shared/services/auth-guard.service';
import { SpareDrivePageComponent } from './spare-drive-page/spare-drive-page.component';
import { SpareDriveSidebarComponent } from './spare-drive-sidebar/spare-drive-sidebar.component';
import { SpareDriveCreationDialogComponent } from './spare-drive-creation/spare-drive-creation-dialog.component';
import { SpareDriveDetailsComponent } from './spare-drive-sidebar/details/spare-drive-details.component';
import {
  SpareDriveSnapshotDetailsComponent
} from './spare-drive-sidebar/snapshot-details/spare-drive-snapshot-details.component';

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
        canActivate: [AuthGuard],
        children: [
          {
            path: '',
            redirectTo: 'volume',
            pathMatch: 'full'
          },
          {
            path: 'volume',
            component: SpareDriveDetailsComponent
          },
          {
            path: 'snapshots',
            component: SpareDriveSnapshotDetailsComponent
          }
        ]
      }
    ]
  }
];

export const spareDrivesRouting = RouterModule.forChild(routes);
