import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SidenavComponent } from './components/sidenav/sidenav.component';
import { MaterialModule } from '../material/material.module';
import { DragulaModule } from 'ng2-dragula';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';


const COMPONENTS = [
  SidenavComponent
];

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    DragulaModule,
    TranslateModule,
    FormsModule,
    RouterModule
  ],
  exports: COMPONENTS,
  declarations: COMPONENTS,
  providers: [],
})
export class CoreModule {
  constructor( @Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(`CoreModule has already been loaded. Import CoreModule in the AppModule only.`);
    }
  }
}
