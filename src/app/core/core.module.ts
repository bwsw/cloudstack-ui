import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DragulaModule } from 'ng2-dragula';

import { MaterialModule } from '../material/material.module';
import { SharedModule } from '../shared/shared.module';

import { SidenavComponent } from './components';
import { ConfigService, SnackBarService, SystemTagsService } from './services';

const COMPONENTS = [
  SidenavComponent
];

const SERVICES = [
  ConfigService,
  SnackBarService,
  SystemTagsService
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MaterialModule,
    DragulaModule,
    RouterModule
  ],
  exports: COMPONENTS,
  declarations: COMPONENTS,
  providers: SERVICES,
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(`CoreModule has already been loaded. Import CoreModule in the AppModule only.`);
    }
  }
}
