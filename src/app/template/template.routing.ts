import { Routes } from '@angular/router';
import { AuthGuard } from '../shared/services/auth-guard.service';
import { TemplateCreationDialogComponent } from './template-creation/template-creation-dialog.component';
import { TemplatePageComponent } from './template-page/template-page.component';
import { IsoDetailsComponent } from './template-sidebar/details/iso-details.component';
import { TemplateDetailsComponent } from './template-sidebar/details/template-details.component';
import { IsoSidebarComponent } from './template-sidebar/iso-sidebar.component';
import { TemplateSidebarComponent } from './template-sidebar/template-sidebar.component';
import { IsoZonesComponent } from './template-sidebar/zones/iso-zones.component';
import { TemplateZonesComponent } from './template-sidebar/zones/template-zones.component';
import { IsoTagsComponent } from './template-tags/iso-tags.component';
import { TemplateTagsComponent } from './template-tags/template-tags.component';

export const templateRouting: Routes = [
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
        component: IsoSidebarComponent,
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
