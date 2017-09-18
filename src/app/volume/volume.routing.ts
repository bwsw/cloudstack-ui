import { Routes } from '@angular/router';
import { AuthGuard } from '../shared/services/auth-guard.service';
import { VolumeCreationDialogComponent } from './volume-creation/volume-creation-dialog.component';
import { VolumePageComponent } from './volume-page/volume-page.component';
import { VolumeDetailsComponent } from './volume-sidebar/details/volume-details.component';
import { VolumeSnapshotDetailsComponent } from './volume-sidebar/snapshot-details/volume-snapshot-details.component';
import { VolumeSidebarComponent } from './volume-sidebar/volume-sidebar.component';

export const volumeRoutes: Routes = [
  {
    path: 'storage',
    component: VolumePageComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'create',
        component: VolumeCreationDialogComponent
      }, {
        path: ':id',
        component: VolumeSidebarComponent,
        canActivate: [AuthGuard],
        children: [
          {
            path: '',
            redirectTo: 'volume',
            pathMatch: 'full'
          },
          {
            path: 'volume',
            component: VolumeDetailsComponent
          },
          {
            path: 'snapshots',
            component: VolumeSnapshotDetailsComponent
          }
        ]
      }
    ]
  }
];
