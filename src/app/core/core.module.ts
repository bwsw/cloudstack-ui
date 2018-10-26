import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ConfigValidationService } from './config';
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../material/material.module';
import {
  AppNavComponent,
  LicenseComponent,
  MenuHeaderComponent,
  SectionNavComponent,
} from './nav-menu/components/';
import { SnackBarService } from './services';

@NgModule({
  imports: [CommonModule, SharedModule, MaterialModule, RouterModule],
  exports: [AppNavComponent, SectionNavComponent],
  declarations: [AppNavComponent, SectionNavComponent, LicenseComponent, MenuHeaderComponent],
  providers: [ConfigValidationService, SnackBarService],
})
export class CoreModule {
  constructor(
    @Optional()
    @SkipSelf()
    parentModule: CoreModule,
  ) {
    if (parentModule) {
      throw new Error(
        `CoreModule has already been loaded. Import CoreModule in the AppModule only.`,
      );
    }
  }
}
