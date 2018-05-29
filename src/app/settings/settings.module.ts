import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ClipboardModule, ClipboardService } from 'ngx-clipboard';
import { SharedModule } from '../shared/shared.module';
import { ApiInfoComponent } from './api-info/api-info.component';
import { InactivityTimeoutComponent } from './inactivity-timeout/inactivity-timeout.component';
import { SettingsComponent } from './settings.component';
import { MaterialModule } from '../material/material.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    MaterialModule,
    SharedModule,
    ReactiveFormsModule,
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
