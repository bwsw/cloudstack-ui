import { Routes } from '@angular/router';
import { AuthGuard } from '../shared/services/auth-guard.service';
import { VolumeCreationComponent } from './volume-creation/volume-creation.component';
import { VolumeSnapshotDetailsComponent } from './volume-sidebar/snapshot-details/volume-snapshot-details.component';
import { VolumePageContainerComponent } from './container/volume.container';
import { VolumeDetailsContainerComponent } from './container/volume-details.container';
import { VolumeSidebarContainerComponent } from './container/volume-sidebar.container';

export const volumeRoutes: Routes = [
  {
    path: 'storage',
    component: VolumePageContainerComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'create',
        component: VolumeCreationComponent
      }, {
        path: ':id',
        component: VolumeSidebarContainerComponent,
        canActivate: [AuthGuard],
        children: [
          {
            path: '',
            redirectTo: 'volume',
            pathMatch: 'full'
          },
          {
            path: 'volume',
            component: VolumeDetailsContainerComponent
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
