import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClipboardModule, ClipboardService } from 'ngx-clipboard';

import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../material/material.module';

import { SettingsComponent } from './containers';
import {
  ApiSettingsComponentComponent,
  InterfaceSettingsComponent,
  PasswordUpdateFormComponent,
  SecuritySettingsComponent,
  SessionTimeoutComponent,
  ThemeSelectorComponent,
  VmSettingsComponent,
} from './components';

@NgModule({
  imports: [CommonModule, SharedModule, MaterialModule, ClipboardModule],
  exports: [SettingsComponent],
  providers: [ClipboardService],
  declarations: [
    SettingsComponent,
    SecuritySettingsComponent,
    VmSettingsComponent,
    ApiSettingsComponentComponent,
    InterfaceSettingsComponent,
    ThemeSelectorComponent,
    PasswordUpdateFormComponent,
    SessionTimeoutComponent,
  ],
})
export class SettingsModule {}
