import { Routes } from '@angular/router';
import { AuthGuard } from '../shared/services/auth-guard.service';
import { VmCreationDialogComponent } from './vm-creation/vm-creation-dialog.component';
import { VmListComponent } from './vm-list/vm-list.component';
import { NetworkDetailComponent } from './vm-sidebar/network-detail/network-detail.component';
import { StorageDetailComponent } from './vm-sidebar/storage-detail/storage-detail.component';
import { VmDetailComponent } from './vm-sidebar/vm-detail/vm-detail.component';
import { VmSidebarComponent } from './vm-sidebar/vm-sidebar.component';
import { VmTagsComponent } from './vm-tags/vm-tags.component';

export const vmRoutes: Routes = [
  {
    path: 'instances',
    component: VmListComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'create',
        component: VmCreationDialogComponent
      },
      {
        path: ':id',
        component: VmSidebarComponent,
        canActivate: [AuthGuard],
        children: [
          {
            path: '',
            redirectTo: 'vm',
            pathMatch: 'full'
          }, {
            path: 'vm',
            component: VmDetailComponent,
            canActivate: [AuthGuard]
          }, {
            path: 'disks',
            component: StorageDetailComponent,
            canActivate: [AuthGuard]
          }, {
            path: 'network',
            component: NetworkDetailComponent,
            canActivate: [AuthGuard]
          }, {
            path: 'tags',
            component: VmTagsComponent,
            canActivate: [AuthGuard]
          }
        ]
      }
    ]
  }
];
