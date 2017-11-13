import { Routes } from '@angular/router';
import { AuthGuard } from '../shared/services/auth-guard.service';
import { IsoDetailsComponent } from './template-sidebar/details/iso-details.component';
import { TemplateDetailsComponent } from './template-sidebar/details/template-details.component';
import { IsoZonesComponent } from './template-sidebar/zones/iso-zones.component';
import { TemplateZonesComponent } from './template-sidebar/zones/template-zones.component';
import { IsoTagsComponent } from './template-tags/iso-tags.component';
import { TemplateTagsComponent } from './template-tags/template-tags.component';
import { TemplatePageContainerComponent } from './containers/template-page.container';
import { TemplateCreationDialogComponent } from './template-creation/template-creation-dialog.component';
import { TemplateSidebarContainerComponent } from './template-sidebar/containers/template-sidebar.container';
import { IsoSidebarContainerComponent } from './template-sidebar/containers/iso-sidebar.container';

export const templateRouting: Routes = [
  {
    path: 'templates',
    component: TemplatePageContainerComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'create',
        component: TemplateCreationDialogComponent
      },
      {
        path: 'template/:id',
        component: TemplateSidebarContainerComponent,
        canActivate: [AuthGuard],
        children: [
          {
            path: '',
            redirectTo: 'details',
            pathMatch: 'full'
          }, {
            path: 'details',
            component: TemplateDetailsComponent,
            canActivate: [AuthGuard]
          }, {
            path: 'zones',
            component: TemplateZonesComponent,
            canActivate: [AuthGuard]
          }, {
            path: 'tags',
            component: TemplateTagsComponent,
            canActivate: [AuthGuard]
          }
        ]
      },
      {
        path: 'iso/:id',
        component: IsoSidebarContainerComponent,
        canActivate: [AuthGuard],
        children: [
          {
            path: '',
            redirectTo: 'details',
            pathMatch: 'full'
          }, {
            path: 'details',
            component: IsoDetailsComponent,
            canActivate: [AuthGuard]
          }, {
            path: 'zones',
            component: IsoZonesComponent,
            canActivate: [AuthGuard]
          }, {
            path: 'tags',
            component: IsoTagsComponent,
            canActivate: [AuthGuard]
          }
        ]
      }
    ]
  }
];
