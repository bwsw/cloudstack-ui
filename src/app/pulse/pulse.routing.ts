import { RouterModule, Routes } from '@angular/router';
import { PulseLazyComponent } from './pulse-lazy.component';

const routes: Routes = [
  {
    path: ':id',
    component: PulseLazyComponent,
    outlet: 'pulse'
  }
];

export const PulseRouting = RouterModule.forChild(routes);
