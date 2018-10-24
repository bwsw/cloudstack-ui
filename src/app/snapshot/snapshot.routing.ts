import { Routes } from '@angular/router';
import { AuthGuard } from '../shared/services/auth-guard.service';
import { SnapshotSidebarContainerComponent } from './snapshots-page/snapshot-sidebar/snapshot-sidebar.container';
import { SnapshotsPageContainerComponent } from './snapshots-page/snapshots-page.container';

export const snapshotRoutes: Routes = [
  {
    path: 'snapshots',
    component: SnapshotsPageContainerComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: ':id',
        component: SnapshotSidebarContainerComponent,
        canActivate: [AuthGuard],
      },
    ],
  },
];
