import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../shared/services';
import { TemplatePageComponent } from './template-page/template-page.component';
import { AsdSidebarComponent } from './template-sidebar/asd-sidebar.component';
import { IsoSidebarComponent } from './template-sidebar/iso-sidebar.component';

const routes: Routes = [
  {
    path: 'templates',
    component: TemplatePageComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'template/:id',
        component: AsdSidebarComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'iso/:id',
        component: IsoSidebarComponent,
        canActivate: [AuthGuard]
      }
    ]
  }
];

export const templatesRouting = RouterModule.forChild(routes);

