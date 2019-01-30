import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ClipboardModule, ClipboardService } from 'ngx-clipboard';

import { MaterialModule } from '../material/material.module';
import { SharedModule } from '../shared/shared.module';
import {
  ApiSettingsComponentComponent,
  InterfaceSettingsComponent,
  PasswordUpdateFormComponent,
  SecuritySettingsComponent,
  SessionTimeoutComponent,
  ThemeSelectorComponent,
  UpdateButtonFieldGroupComponent,
  VmLogsMessagesComponent,
  VmLogsMinutesComponent,
  VmLogsSettingsComponent,
  VmSettingsComponent,
} from './components';
import { SettingsComponent } from './containers';
import { TagsSettingsComponent } from './components/tags-settings/tags-settings.component';
import { TagsModule } from '../tags/tags.module';

@NgModule({
  imports: [CommonModule, SharedModule, MaterialModule, ClipboardModule, TagsModule],
  exports: [SettingsComponent],
  providers: [ClipboardService],
  declarations: [
    SettingsComponent,
    SecuritySettingsComponent,
    TagsSettingsComponent,
    VmSettingsComponent,
    ApiSettingsComponentComponent,
    InterfaceSettingsComponent,
    ThemeSelectorComponent,
    PasswordUpdateFormComponent,
    SessionTimeoutComponent,
    UpdateButtonFieldGroupComponent,
    VmLogsMessagesComponent,
    VmLogsMinutesComponent,
    VmLogsSettingsComponent,
  ],
})
export class SettingsModule {}
