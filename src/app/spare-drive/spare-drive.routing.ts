import { Routes } from '@angular/router';
import { AuthGuard } from '../shared/services/auth-guard.service';
import { SpareDriveCreationDialogComponent } from './volume-creation/volume-creation-dialog.component';
import { SpareDrivePageComponent } from './volume-page/volume-page.component';
import { SpareDriveDetailsComponent } from './volume-sidebar/details/volume-details.component';
import { SpareDriveSnapshotDetailsComponent } from './volume-sidebar/snapshot-details/volume-snapshot-details.component';
import { SpareDriveSidebarComponent } from './volume-sidebar/volume-sidebar.component';

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
