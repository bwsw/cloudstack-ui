import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from 'ng2-translate';
import { MdlModule } from 'angular2-mdl';
import { SharedModule } from '../shared/shared.module';
import { IsoComponent } from './iso.component';


@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    MdlModule,
    SharedModule
  ],
  exports: [
    IsoComponent
  ],
  declarations: [
    IsoComponent
  ]
})
export class IsoModule { }
