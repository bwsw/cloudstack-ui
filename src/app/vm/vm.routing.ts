import { Routes } from '@angular/router';
import { AuthGuard } from '../shared/services/auth-guard.service';
import { VmCreationDialogComponent } from './vm-creation/vm-creation-dialog.component';
import { VirtualMachinePageContainerComponent } from './container/vm.container';
import { VmDetailContainerComponent } from './container/vm-detail.container';
import { VmSidebarContainerComponent } from './container/vm-sidebar.container';
import { StorageDetailContainerComponent } from './container/storage-detail.container';
import { NetworkDetailContainerComponent } from './container/network-detail.container';
import { VmTagsContainerComponent } from './container/vm-tags.container';

export const vmRoutes: Routes = [
  {
    path: 'instances',
    component: VirtualMachinePageContainerComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'create',
        component: VmCreationDialogComponent,
      },
      {
        path: ':id',
        component: VmSidebarContainerComponent,
        canActivate: [AuthGuard],
        children: [
          {
            path: '',
            redirectTo: 'vm',
            pathMatch: 'full',
          },
          {
            path: 'vm',
            component: VmDetailContainerComponent,
            canActivate: [AuthGuard],
          },
          {
            path: 'disks',
            component: StorageDetailContainerComponent,
            canActivate: [AuthGuard],
          },
          {
            path: 'network',
            component: NetworkDetailContainerComponent,
            canActivate: [AuthGuard],
          },
          {
            path: 'tags',
            component: VmTagsContainerComponent,
            canActivate: [AuthGuard],
          },
        ],
      },
    ],
  },
];
