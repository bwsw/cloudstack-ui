import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../shared/services/auth-guard.service';
import { EventListComponent } from './event-list.component';

export const routes: Routes = [
  {
    path: '',
    component: EventListComponent,
    canActivate: [AuthGuard]
  },
];

export const EventsRouting = RouterModule.forChild(routes);
