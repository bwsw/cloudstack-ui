import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';
import { IsoService, TemplateService } from './shared';
import { TemplateListComponent } from './template-list/template-list.component';


@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [
    TemplateListComponent
  ],
  providers: [
    IsoService,
    TemplateService
  ],
  entryComponents: []
})
export class TemplateModule { }
