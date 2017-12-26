import { Routes } from '@angular/router';
import { AuthGuard } from '../shared/services/auth-guard.service';
import { SnapshotsPageContainerComponent } from './snapshots-page/snapshots-page.container';


export const snapshotRoutes: Routes = [
  {
    path: 'snapshots',
    component: SnapshotsPageContainerComponent,
    canActivate: [AuthGuard]
  }
];
