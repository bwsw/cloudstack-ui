import { Routes } from '@angular/router';
import { AuthGuard } from '../shared/services/auth-guard.service';
import { VmCreationDialogComponent } from './vm-creation/vm-creation-dialog.component';
import { NetworkDetailComponent } from './vm-sidebar/network-detail/network-detail.component';
import { VmTagsComponent } from './vm-tags/vm-tags.component';
import { VirtualMachinePageContainerComponent } from './container/vm.container';
import { VmDetailContainerComponent } from './container/vm-detail.container';
import { VmSidebarContainerComponent } from './container/vm-sidebar.container';
import { StorageDetailContainerComponent } from './container/storage-detail.container';

export const vmRoutes: Routes = [
  {
    path: 'instances',
    component: VirtualMachinePageContainerComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'create',
        component: VmCreationDialogComponent
      },
      {
        path: ':id',
        component: VmSidebarContainerComponent,
        canActivate: [AuthGuard],
        children: [
          {
            path: '',
            redirectTo: 'vm',
            pathMatch: 'full'
          }, {
            path: 'vm',
            component: VmDetailContainerComponent,
            canActivate: [AuthGuard]
          }, {
            path: 'disks',
            component: StorageDetailContainerComponent,
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
