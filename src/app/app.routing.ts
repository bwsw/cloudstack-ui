import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './auth/login.component';
import { SgTemplateListComponent } from './security-group/sg-template-list/sg-template-list.component';
import { TemplateListComponent } from './template/template-list/template-list.component';
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
    component: TemplateListComponent
  },
  {
    path: '**',
    redirectTo: '/instances'
  }
];

export const routing = RouterModule.forRoot(routes);
