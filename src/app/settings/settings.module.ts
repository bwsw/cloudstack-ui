import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from 'ng2-translate';
import { MdlModule } from 'angular2-mdl';
import { MdlSelectModule } from '@angular2-mdl-ext/select';
import { SettingsComponent } from './settings.component';


@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    MdlModule,
    MdlSelectModule
  ],
  exports: [
    SettingsComponent
  ],
  declarations: [
    SettingsComponent
  ]
})
export class SettingsModule { }
