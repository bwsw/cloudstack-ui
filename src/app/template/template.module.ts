import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MdlModule } from '@angular-mdl/core';
import { MdlSelectModule } from '@angular-mdl/select';

import { SharedModule } from '../shared/shared.module';
import { IsoService, TemplateService } from './shared';
import { TemplatePageComponent } from './template-page/template-page.component';
import { TemplateCreationComponent } from './template-creation/template-creation.component';
import { TemplateSidebarComponent } from './template-sidebar/template-sidebar.component';
import { IsoAttachmentComponent } from './iso-attachment/iso-attachment.component';
import { TemplateFilterListComponent } from './template-filter-list/template-filter-list.component';
import { TemplateFiltersComponent } from './template-filters/template-filters.component';
import { TemplateListComponent } from './template-list/template-list.component';
import { TemplateComponent } from './template/template.component';
import { MdlPopoverModule } from '@angular-mdl/popover';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    MdlModule,
    MdlPopoverModule,
    MdlSelectModule,
    SharedModule
  ],
  declarations: [
    IsoAttachmentComponent,
    TemplateComponent,
    TemplateCreationComponent,
    TemplateFiltersComponent,
    TemplateListComponent,
    TemplateFilterListComponent,
    TemplatePageComponent,
    TemplateSidebarComponent
  ],
  exports: [
    TemplateFilterListComponent
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
