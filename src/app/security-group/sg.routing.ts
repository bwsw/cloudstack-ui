import { Routes } from '@angular/router';
import { AuthGuard } from '../shared/services/auth-guard.service';
import { SgTemplateCreationDialogComponent } from './sg-template-creation/sg-template-creation-dialog.component';
import { SgTemplateListComponent } from './sg-template-list/sg-template-list.component';

export const sgRoutes: Routes = [
  {
    path: 'sg-templates',
    component: SgTemplateListComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'create',
        component: SgTemplateCreationDialogComponent
      }
    ]
  }
];
