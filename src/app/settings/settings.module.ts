import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import {
  MatButtonModule,
  MatCheckboxModule,
  MatIconModule,
  MatInputModule,
  MatSelectModule,
  MatTooltipModule
} from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';
import { ClipboardModule, ClipboardService } from 'ngx-clipboard';
import { SharedModule } from '../shared/shared.module';
import { ApiInfoComponent } from './api-info/api-info.component';
import { InactivityTimeoutComponent } from './inactivity-timeout/inactivity-timeout.component';
import { SettingsComponent } from './settings.component';
import { KeyboardsComponent } from '../vm/vm-creation/keyboards/keyboards.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    MatTooltipModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
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
    SettingsComponent,
    KeyboardsComponent
  ]
})
export class SettingsModule {
}
