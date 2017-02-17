import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './auth/login.component';
import { RecurringSnapshotsComponent } from './snapshot/recurring-snapshots/recurring-snapshots.component';
import { SgTemplateListComponent } from './security-group/sg-template-list/sg-template-list.component';
import { TemplatePageComponent } from './template/template-page/template-page.component';
import { VmListComponent } from './vm/vm-list/vm-list.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'sg-templates',
    component: SgTemplateListComponent
  },
  {
    path: 'instances',
    component: VmListComponent
  },
  {
    path: 'templates',
    component: TemplatePageComponent
  },
  {
    path: 'test',
    component: RecurringSnapshotsComponent
  },
  {
    path: '**',
    redirectTo: '/instances'
  }
];

export const routing = RouterModule.forRoot(routes);
