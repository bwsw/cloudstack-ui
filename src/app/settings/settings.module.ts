import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClipboardModule } from 'ngx-clipboard/dist';
import { TranslateModule } from '@ngx-translate/core';
import { MdlModule } from '@angular-mdl/core';
import { MdlSelectModule } from '@angular-mdl/select';
import { SettingsComponent } from './settings.component';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ApiInfoComponent } from './api-info/api-info.component';
import { InactivityTimeoutComponent } from './inactivity-timeout/inactivity-timeout.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    MdlModule,
    MdlSelectModule,
    SharedModule,
    ReactiveFormsModule,
    ClipboardModule
  ],
  exports: [
    SettingsComponent
  ],
  declarations: [
    ApiInfoComponent,
    InactivityTimeoutComponent,
    SettingsComponent
  ]
})
export class SettingsModule { }
