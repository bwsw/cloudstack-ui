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
import { TemplateCreationComponent } from './template-creation/template-creation.component';
import { TemplateFilterListSelectorComponent } from './template-filter-list/template-filter-list-selector/template-filter-list-selector.component';
import { TemplateFilterListComponent } from './template-filter-list/template-filter-list/template-filter-list.component';
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
import { TemplateCreationDialogComponent } from './template-creation/template-creation-dialog.component';
import { TemplateComponent } from './template/template.component';
import { TemplateActionsService } from '../shared/actions/template-actions/template-actions.service';
import { TemplateCreateAction } from '../shared/actions/template-actions/create/template-create';
import { TemplateDeleteAction } from '../shared/actions/template-actions/delete/template-delete';
import { IsoCreateAction } from '../shared/actions/template-actions/create/iso-create';
import { IsoDeleteAction } from '../shared/actions/template-actions/delete/iso-delete';
import { IsoActionsService } from '../shared/actions/template-actions/iso-actions.service';
import { TemplateDescriptionComponent } from './template-sidebar/template-description/template-description.component';
import { TemplateOsComponent } from './template-sidebar/template-os/template-os.component';
import { TemplateOsIconComponent } from './template-sidebar/template-os-icon/template-os-icon.component';
import { TemplateZonesComponent } from './template-sidebar/zones/template-zones.component';
import { IsoZonesComponent } from './template-sidebar/zones/iso-zones.component';
import { TemplateDetailsComponent } from './template-sidebar/details/template/template-details.component';
import { IsoDetailsComponent } from './template-sidebar/details/iso/iso-details.component';
import { IsoTagsComponent } from './template-tags/iso-tags.component';
import { templatesRouting } from './template.routing';
import { DownloadUrlComponent } from './template-sidebar/details/download-url/download-url.component';
import { IsoGeneralInformationComponent } from './template-sidebar/details/iso-general-information/iso-general-information.component';
import { TemplateGeneralInformationComponent } from './template-sidebar/details/template-general-information/template-general-information.component';


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
    TemplateTagsComponent,
    IsoTagsComponent,
    TemplateZonesComponent,
    IsoZonesComponent,
    TemplateDetailsComponent,
    IsoDetailsComponent,
    DownloadUrlComponent,
    IsoGeneralInformationComponent,
    TemplateGeneralInformationComponent
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
export class TemplateModule {
}
