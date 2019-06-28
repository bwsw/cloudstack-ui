import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ConfigValidationService } from './config';
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../material/material.module';
import { AppNavComponent, LicenseComponent, MenuHeaderComponent } from './nav-menu/components/';
import { SidebarWidthService, SnackBarService } from './services';

@NgModule({
  imports: [CommonModule, SharedModule, MaterialModule, RouterModule],
  exports: [AppNavComponent],
  declarations: [AppNavComponent, LicenseComponent, MenuHeaderComponent],
  providers: [ConfigValidationService, SnackBarService, SidebarWidthService],
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
