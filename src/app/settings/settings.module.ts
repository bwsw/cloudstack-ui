import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from 'ng2-translate';
import { MdlModule } from 'angular2-mdl';
import { MdlSelectModule } from '@angular2-mdl-ext/select';
import { SettingsComponent } from './settings.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    MdlModule,
    MdlSelectModule,
    SharedModule
  ],
  exports: [
    SettingsComponent
  ],
  declarations: [
    SettingsComponent
  ]
})
export class SettingsModule { }
