import { Routes } from '@angular/router';
import { AuthGuard } from '../shared/services/auth-guard.service';
import { SpareDriveCreationDialogComponent } from './spare-drive-creation/spare-drive-creation-dialog.component';
import { SpareDrivePageComponent } from './spare-drive-page/spare-drive-page.component';
import { SpareDriveDetailsComponent } from './spare-drive-sidebar/details/spare-drive-details.component';
import { SpareDriveSnapshotDetailsComponent } from './spare-drive-sidebar/snapshot-details/spare-drive-snapshot-details.component';
import { SpareDriveSidebarComponent } from './spare-drive-sidebar/spare-drive-sidebar.component';

export const spareDriveRoutes: Routes = [
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
