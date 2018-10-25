import { Routes } from '@angular/router';
import { AuthGuard } from '../shared/services/auth-guard.service';
import { TemplatePageContainerComponent } from './containers/template-page.container';
import { TemplateCreationDialogComponent } from './template-creation/template-creation-dialog.component';
import { BaseTemplateSidebarContainerComponent } from './template-sidebar/containers/base-template-sidebar.container';
import { DetailsContainerComponent } from './template-sidebar/containers/details.container';
import { TemplateZonesContainerComponent } from './template-sidebar/containers/template-zones.container';
import { TagsContainerComponent } from './template-sidebar/containers/tags.container';
import { IsoZonesContainerComponent } from './template-sidebar/containers/iso-zones.container';

export const templateRouting: Routes = [
  {
    path: 'templates',
    component: TemplatePageContainerComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'create',
        component: TemplateCreationDialogComponent,
      },
      {
        path: 'template/:id',
        component: BaseTemplateSidebarContainerComponent,
        canActivate: [AuthGuard],
        children: [
          {
            path: '',
            redirectTo: 'details',
            pathMatch: 'full',
          },
          {
            path: 'details',
            component: DetailsContainerComponent,
            canActivate: [AuthGuard],
          },
          {
            path: 'zones',
            component: TemplateZonesContainerComponent,
            canActivate: [AuthGuard],
          },
          {
            path: 'tags',
            component: TagsContainerComponent,
            canActivate: [AuthGuard],
          },
        ],
      },
      {
        path: 'iso/:id',
        component: BaseTemplateSidebarContainerComponent,
        canActivate: [AuthGuard],
        children: [
          {
            path: '',
            redirectTo: 'details',
            pathMatch: 'full',
          },
          {
            path: 'details',
            component: DetailsContainerComponent,
            canActivate: [AuthGuard],
          },
          {
            path: 'zones',
            component: IsoZonesContainerComponent,
            canActivate: [AuthGuard],
          },
          {
            path: 'tags',
            component: TagsContainerComponent,
            canActivate: [AuthGuard],
          },
        ],
      },
    ],
  },
];
