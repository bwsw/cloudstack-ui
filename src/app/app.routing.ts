import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './auth/login.component';
import { SgTemplateListComponent } from './security-group/sg-template-list/sg-template-list.component';
import { TemplatePageComponent } from './template/template-page/template-page.component';
import { VmListComponent } from './vm/vm-list/vm-list.component';
import { EventListComponent } from './events/event-list.component';

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
    path: 'events',
    component: EventListComponent
  },
  {
    path: '**',
    redirectTo: '/instances'
  }
];

export const routing = RouterModule.forRoot(routes);
