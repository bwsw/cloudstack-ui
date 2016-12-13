import { RouterModule, Routes } from '@angular/router';

import { AboutComponent } from './about/about.component';
import { HomeComponent } from './home/home.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { VmListComponent } from './vm/vm-list.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'login', component: LoginFormComponent },
  { path: 'instances', component: VmListComponent }
];

export const routing = RouterModule.forRoot(routes);
