import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../shared/services/auth-guard.service';
import { TemplatePageComponent } from './template-page/template-page.component';
import { IsoSidebarComponent } from './template-sidebar/iso-sidebar.component';
import { TemplateSidebarComponent } from './template-sidebar/template-sidebar.component';
import { TemplateCreationDialogComponent } from './template-creation/template-creation-dialog.component';

const routes: Routes = [
  {
    path: 'templates',
    component: TemplatePageComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'create',
        component: TemplateCreationDialogComponent
      },
      {
        path: 'template/:id',
        component: TemplateSidebarComponent,
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

