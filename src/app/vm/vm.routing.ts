import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../shared/services/auth-guard.service';
import { VmListComponent } from './vm-list/vm-list.component';
import { VmSidebarComponent } from './vm-sidebar/vm-sidebar.component';
import { VmCreationDialogComponent } from './vm-creation/vm-creation-dialog.component';

const routes: Routes = [
  {
    path: 'instances',
    component: VmListComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'create',
        component: VmCreationDialogComponent
      }, {
        path: ':id',
        component: VmSidebarComponent,
        canActivate: [AuthGuard]
      }
    ]
  }
];

export const vmRouting = RouterModule.forChild(routes);
