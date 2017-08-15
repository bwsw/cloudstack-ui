import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../shared/services/auth-guard.service';
import { SgTemplateListComponent } from './sg-template-list/sg-template-list.component';

const routes: Routes = [
  {
    path: '',
    component: SgTemplateListComponent,
    canActivate: [AuthGuard]
  }
];

export const SecurityGroupsRouting = RouterModule.forChild(routes);
