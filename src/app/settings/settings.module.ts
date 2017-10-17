import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import {
  MdButtonModule,
  MdCheckboxModule,
  MdIconModule,
  MdInputModule,
  MdSelectModule,
  MdTooltipModule
} from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';
import { ClipboardModule } from 'ngx-clipboard/dist';
import { SharedModule } from '../shared/shared.module';
import { ApiInfoComponent } from './api-info/api-info.component';
import { InactivityTimeoutComponent } from './inactivity-timeout/inactivity-timeout.component';
import { SettingsComponent } from './settings.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    MdTooltipModule,
    MdButtonModule,
    MdIconModule,
    MdInputModule,
    MdSelectModule,
    MdCheckboxModule,
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
