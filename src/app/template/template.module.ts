import { MdlModule } from '@angular-mdl/core';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MdButtonModule,
  MdIconModule,
  MdMenuModule,
  MdSelectModule,
  MdTabsModule,
  MdTooltipModule
} from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';
import { DynamicModule } from 'ng-dynamic-component';
import { ClipboardModule } from 'ngx-clipboard/dist';
import { SharedModule } from '../shared/shared.module';
import { TagsModule } from '../tags/tags.module';
import { IsoAttachmentComponent } from './iso-attachment/iso-attachment.component';
import { IsoService, TemplateService } from './shared';
import { TemplateActionsComponent } from './template-actions/template-actions-component/template-actions.component';
import { TemplateCreationComponent } from './template-creation/template-creation.component';
import { TemplateFilterListSelectorComponent } from './template-filter-list/template-filter-list-selector.component';
import { TemplateFilterListComponent } from './template-filter-list/template-filter-list.component';
import { TemplateFiltersComponent } from './template-filters/template-filters.component';
import { TemplateCardListComponent } from './template-list/template-card-list.component';
import { TemplateListComponent } from './template-list/template-list.component';
import { TemplatePageComponent } from './template-page/template-page.component';
import { IsoSidebarComponent } from './template-sidebar/iso-sidebar.component';
import {
  TemplateActionsSidebarComponent
} from './template-sidebar/template-actions-sidebar/template-actions-sidebar.component';
import { TemplateSidebarComponent } from './template-sidebar/template-sidebar.component';
import { TemplateTagsComponent } from './template-tags/template-tags.component';
import { templatesRouting } from './template.routing';
import { TemplateComponent } from './template/template.component';
import { TemplateActionsService } from './template-actions/template-actions.service';
import { TemplateCreateAction } from './template-actions/create/template-create';
import { TemplateDeleteAction } from './template-actions/delete/template-delete';
import { IsoCreateAction } from './template-actions/create/iso-create';
import { IsoDeleteAction } from './template-actions/delete/iso-delete';
import { IsoActionsService } from './template-actions/iso-actions.service';
import { TemplateDescriptionComponent } from './template-sidebar/template-description/template-description.component';
import { TemplateOsComponent } from './template-sidebar/template-os/template-os.component';
import { TemplateOsIconComponent } from './template-sidebar/template-os-icon/template-os-icon.component';
import { TemplateCreationDialogComponent } from './template-creation/template-creation-dialog.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    DynamicModule.withComponents([TemplateComponent]),
    TranslateModule,
    MdTooltipModule,
    MdlModule,
    MdSelectModule,
    SharedModule,
    TagsModule,
    ClipboardModule,
    templatesRouting,
    MdMenuModule,
    MdButtonModule,
    MdIconModule,
    MdTabsModule,
  ],
  declarations: [
    TemplateSidebarComponent,
    IsoSidebarComponent,
    IsoAttachmentComponent,
    TemplateActionsComponent,
    TemplateActionsSidebarComponent,
    TemplateComponent,
    TemplateCreationComponent,
    TemplateDescriptionComponent,
    TemplateCreationDialogComponent,
    TemplateFiltersComponent,
    TemplateListComponent,
    TemplateOsComponent,
    TemplateOsIconComponent,
    TemplateCardListComponent,
    TemplateFilterListComponent,
    TemplateFilterListSelectorComponent,
    TemplatePageComponent,
    TemplateTagsComponent
  ],
  exports: [
    TemplateFilterListSelectorComponent,
    TemplateFilterListComponent
  ],
  providers: [
    IsoService,
    TemplateService,
    TemplateActionsService,
    IsoActionsService,
    TemplateCreateAction,
    TemplateDeleteAction,
    IsoCreateAction,
    IsoDeleteAction
  ],
  entryComponents: [
    IsoAttachmentComponent,
    TemplateCreationComponent
  ]
})
export class TemplateModule { }
