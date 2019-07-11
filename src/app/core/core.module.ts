import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ConfigValidationService } from './config';
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../material/material.module';
import {
  AccountInfoComponent,
  AppNavComponent,
  LicenseComponent,
  MenuHeaderComponent,
} from './nav-menu/components/';
import { SidebarWidthService, SnackBarService } from './services';
import { NavbarComponent } from './navbar/components/navbar.component';
import { NavbarService } from './services/navbar.service';

@NgModule({
  imports: [CommonModule, SharedModule, MaterialModule, RouterModule],
  exports: [AppNavComponent, NavbarComponent],
  declarations: [
    AppNavComponent,
    LicenseComponent,
    MenuHeaderComponent,
    AccountInfoComponent,
    NavbarComponent,
  ],
  providers: [ConfigValidationService, SnackBarService, SidebarWidthService, NavbarService],
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
