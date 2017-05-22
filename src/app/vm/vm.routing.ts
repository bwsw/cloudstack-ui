import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../shared/services';
import { VmListComponent } from './vm-list/vm-list.component';
import { VmSidebarComponent } from './vm-sidebar/vm-sidebar.component';

const routes: Routes = [
  {
    path: 'instances',
    component: VmListComponent,
    canActivate: [AuthGuard],
    children: [{
      path: ':id',
      component: VmSidebarComponent,
      canActivate: [AuthGuard]
    }]
  }
];

export const vmRouting = RouterModule.forChild(routes);
