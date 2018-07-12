import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { ClipboardModule, ClipboardService } from 'ngx-clipboard';

import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../material/material.module';

import { SettingsEffects } from './store/settings.effects';

import { SettingsComponent } from './containers';
import {
  ApiSettingsComponentComponent,
  InterfaceSettingsComponent,
  PasswordUpdateFormComponent,
  SecuritySettingsComponent,
  SessionTimeoutComponent,
  ThemeSelectorComponent
} from './components';
import { SettingsSectionContentDirective, SettingsSectionNameDirective } from './directives';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MaterialModule,
    ClipboardModule,
    EffectsModule.forFeature([SettingsEffects])
  ],
  exports: [SettingsComponent],
  providers: [ClipboardService],
  declarations: [
    SettingsComponent,
    SecuritySettingsComponent,
    ApiSettingsComponentComponent,
    InterfaceSettingsComponent,
    ThemeSelectorComponent,
    PasswordUpdateFormComponent,
    SessionTimeoutComponent,
    SettingsSectionNameDirective,
    SettingsSectionContentDirective
  ]
})
export class SettingsModule {
}
