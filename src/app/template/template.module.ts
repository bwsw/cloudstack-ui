import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MdlPopoverModule } from '@angular2-mdl-ext/popover';
import { MdlSelectModule } from '@angular2-mdl-ext/select';
import { TranslateModule } from '@ngx-translate/core';
import { MdlModule } from 'angular2-mdl';

import { SharedModule } from '../shared/shared.module';
import { IsoAttachmentComponent } from './iso-attachment/iso-attachment.component';
import { IsoService, TemplateService } from './shared';
import { TemplateCreationComponent } from './template-creation/template-creation.component';
import { TemplateFilterListComponent } from './template-filter-list/template-filter-list.component';
import { TemplateFiltersComponent } from './template-filters/template-filters.component';
import { TemplateListComponent } from './template-list/template-list.component';
import { TemplatePageComponent } from './template-page/template-page.component';
import { BaseTemplateSidebarComponent } from './template-sidebar/base-template-sidebar.component';
import { templatesRouting } from './template.routing';
import { TemplateComponent } from './template/template.component';
import { TemplateSidebarComponent } from './template-sidebar/template-sidebar.component';
import { IsoSidebarComponent } from './template-sidebar/iso-sidebar.component';
import { TemplateCardListComponent } from './template-list/template-card-list.component';
import { TemplateActionsService } from './shared/template-actions.service';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    MdlModule,
    MdlPopoverModule,
    MdlSelectModule,
    SharedModule,
    templatesRouting
  ],
  declarations: [
    TemplateSidebarComponent,
    IsoSidebarComponent,
    IsoAttachmentComponent,
    TemplateComponent,
    TemplateCreationComponent,
    TemplateFiltersComponent,
    TemplateListComponent,
    TemplateCardListComponent,
    TemplateFilterListComponent,
    TemplatePageComponent,
    BaseTemplateSidebarComponent
  ],
  exports: [
    TemplateFilterListComponent
  ],
  providers: [
    IsoService,
    TemplateService,
    TemplateActionsService
  ],
  entryComponents: [
    IsoAttachmentComponent,
    TemplateCreationComponent
  ]
})
export class TemplateModule { }
