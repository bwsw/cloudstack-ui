import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ClipboardModule, ClipboardService } from 'ngx-clipboard';

import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../material/material.module';

import { ApiInfoComponent } from './api-info/api-info.component';
import { InactivityTimeoutComponent } from './inactivity-timeout/inactivity-timeout.component';
import { SettingsComponent } from './settings.component';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MaterialModule,
    ClipboardModule
  ],
  exports: [
    SettingsComponent
  ],

  providers: [
    ClipboardService
  ],

  declarations: [
    ApiInfoComponent,
    InactivityTimeoutComponent,
    SettingsComponent
  ]
})
export class SettingsModule {
}
