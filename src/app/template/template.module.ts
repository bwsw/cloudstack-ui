import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from 'ng2-translate';
import { MdlModule } from 'angular2-mdl';
import { MdlSelectModule } from '@angular2-mdl-ext/select';

import { SharedModule } from '../shared/shared.module';
import { IsoService, TemplateService } from './shared';
import { TemplatePageComponent } from './template-page/template-page.component';
import { TemplateCreationComponent } from './template-creation/template-creation.component';
import { TemplateFiltersComponent } from './template-filters/template-filters.component';
import { TemplateSidebarComponent } from './template-sidebar/template-sidebar.component';
import { IsoAttachmentComponent } from './iso-attachment/iso-attachment.component';
import { TemplateListComponent } from './template-list/template-list.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    MdlModule,
    MdlSelectModule,
    SharedModule
  ],
  declarations: [
    IsoAttachmentComponent,
    TemplateCreationComponent,
    TemplateFiltersComponent,
    TemplateListComponent,
    TemplatePageComponent,
    TemplateSidebarComponent
  ],
  providers: [
    IsoService,
    TemplateService
  ],
  entryComponents: [
    IsoAttachmentComponent,
    TemplateCreationComponent
  ]
})
export class TemplateModule { }
