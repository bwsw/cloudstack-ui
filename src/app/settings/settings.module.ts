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
import { UpdateButtonFieldComponent } from './components/update-button-field/update-button-field.component';
import { VmLogsMessagesComponent } from './components/vm-logs-settings/vm-logs-messages/vm-logs-messages.component';
import { VmLogsMinutesComponent } from './components/vm-logs-settings/vm-logs-minutes/vm-logs-minutes.component';
import { VmLogsSettingsComponent } from './components/vm-logs-settings/vm-logs-settings.component';

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
    UpdateButtonFieldComponent,
    VmLogsMessagesComponent,
    VmLogsMinutesComponent,
    VmLogsSettingsComponent,
  ],
})
export class SettingsModule {}
