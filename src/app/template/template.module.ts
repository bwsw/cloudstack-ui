import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatButtonToggleModule,
  MatCheckboxModule,
  MatDialogModule,
  MatIconModule,
  MatInputModule,
  MatMenuModule,
  MatRadioModule,
  MatSelectModule,
  MatTabsModule,
  MatTooltipModule
} from '@angular/material';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { DynamicModule } from 'ng-dynamic-component';
import { ClipboardModule } from 'ngx-clipboard';
import { IsoCreateAction } from '../shared/actions/template-actions/create/iso-create';
import { TemplateCreateAction } from '../shared/actions/template-actions/create/template-create';
import { IsoDeleteAction } from '../shared/actions/template-actions/delete/iso-delete';
import { TemplateDeleteAction } from '../shared/actions/template-actions/delete/template-delete';
import { IsoActionsService } from '../shared/actions/template-actions/iso-actions.service';
import { TemplateActionsService } from '../shared/actions/template-actions/template-actions.service';
import { SharedModule } from '../shared/shared.module';
import { TagsModule } from '../tags/tags.module';
import { IsoAttachmentComponent } from './iso-attachment/iso-attachment.component';
import {
  IsoService,
  TemplateService
} from './shared';
import { TemplateCreationDialogComponent } from './template-creation/template-creation-dialog.component';
import { TemplateCreationComponent } from './template-creation/template-creation.component';
import { TemplateFilterListSelectorComponent } from './template-filter-list/template-filter-list-selector.component';
import { TemplateFilterListComponent } from './template-filter-list/template-filter-list.component';
import { TemplateFiltersComponent } from './template-filters/template-filters.component';
import { TemplateCardListComponent } from './template-list/template-card-list.component';
import { TemplateListComponent } from './template-list/template-list.component';
import { TemplatePageComponent } from './template-page/template-page.component';
import { IsoDetailsComponent } from './template-sidebar/details/iso-details.component';
import { TemplateDetailsComponent } from './template-sidebar/details/template-details.component';
import { IsoSidebarComponent } from './template-sidebar/iso-sidebar.component';
import { TemplateDescriptionComponent } from './template-sidebar/template-description/template-description.component';
import { TemplateOsIconComponent } from './template-sidebar/template-os-icon/template-os-icon.component';
import { TemplateOsComponent } from './template-sidebar/template-os/template-os.component';
import { TemplateSidebarComponent } from './template-sidebar/template-sidebar.component';
import { IsoZonesComponent } from './template-sidebar/zones/iso-zones.component';
import { TemplateZonesComponent } from './template-sidebar/zones/template-zones.component';
import { TemplateTagsComponent } from './template-tags/template-tags.component';
// tslint:disable-next-line
import { TemplateActionsSidebarComponent } from './template-sidebar/template-actions-sidebar/template-actions-sidebar.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { TemplateEffects } from '../reducers/templates/redux/template.effects';
import { templateReducers } from '../reducers/templates/redux/template.reducers';
import { osTypeReducers } from '../reducers/templates/redux/ostype.reducers';
import { OsTypeEffects } from '../reducers/templates/redux/ostype.effects';
import { TemplateOsContainerComponent } from './template-sidebar/template-os/template-os.container';
import { zoneReducers } from '../reducers/templates/redux/zone.reducers';
import { ZoneEffects } from '../reducers/templates/redux/zone.effects';
import { TemplatePageContainerComponent } from './containers/template-page.container';
import { TemplateCreationContainerComponent } from './template-creation/containers/template-creation.container';
// tslint:disable-next-line
import { TemplateActionsSidebarContainerComponent } from './template-sidebar/template-actions-sidebar/containers/template-actions-sidebar.container';
import { TemplateFilterContainerComponent } from './containers/template-filter.container';
import { TemplateCardItemComponent } from './template/card-item/template-card-item.component';
import { TemplateRowItemComponent } from './template/row-item/template-row-item.component';
import { TemplateOsIconContainerComponent } from './template-sidebar/template-os-icon/template-os-icon.container';
import { TemplateGroupService } from '../shared/services/template-group.service';
// tslint:disable-next-line
import { TemplateGroupSelectorComponent } from './template-sidebar/template-group/template-group-selector/template-group-selector.component';
import { TemplateGroupComponent } from './template-sidebar/template-group/template-group.component';
import { templateGroupReducers } from '../reducers/templates/redux/template-group.reducers';
import { TemplateGroupEffects } from '../reducers/templates/redux/template-group.effects';
import { TemplateGroupContainerComponent } from './template-sidebar/template-group/containers/template-group.container';
import { BaseTemplateSidebarContainerComponent } from './template-sidebar/containers/base-template-sidebar.container';
import { DraggableSelectModule } from '../shared/components/draggable-select/draggable-select.module';
import { DetailsContainerComponent } from './template-sidebar/containers/details.container';
import { TemplateZonesContainerComponent } from './template-sidebar/containers/template-zones.container';
import { TagsContainerComponent } from './template-sidebar/containers/tags.container';
import { TemplateFilterListSelectorContainerComponent } from './containers/template-filter-selector.container';
import { IsoZonesContainerComponent } from './template-sidebar/containers/iso-zones.container';
import { TemplateFilterListContainerComponent } from './template-filter-list/containers/template-filter-list.container';
// tslint:disable-next-line
import { TemplateGroupSelectorContainerComponent } from './template-sidebar/template-group/containers/template-group-selector.container';
import { IsoAttachmentFilterSelectorContainerComponent } from './containers/iso-attachment-filter-selector.container';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ClipboardModule,
    DraggableSelectModule,
    DynamicModule.withComponents([TemplateCardItemComponent, TemplateRowItemComponent]),
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatRadioModule,
    MatSelectModule,
    MatTabsModule,
    MatTooltipModule,
    MatButtonToggleModule,
    RouterModule,
    SharedModule,
    TagsModule,
    TranslateModule,
    StoreModule.forFeature('templates', templateReducers),
    StoreModule.forFeature('osTypes', osTypeReducers),
    StoreModule.forFeature('zones', zoneReducers),
    StoreModule.forFeature('templateGroups', templateGroupReducers),
    EffectsModule.forFeature([
      TemplateEffects,
      OsTypeEffects,
      ZoneEffects,
      TemplateGroupEffects
    ]),
  ],
  declarations: [
    TemplateSidebarComponent,
    BaseTemplateSidebarContainerComponent,
    IsoSidebarComponent,
    IsoAttachmentComponent,
    TemplateActionsSidebarContainerComponent,
    TemplateActionsSidebarComponent,
    TemplateCardItemComponent,
    TemplateRowItemComponent,
    TemplateCreationComponent,
    TemplateDescriptionComponent,
    TemplateCreationContainerComponent,
    TemplateCreationDialogComponent,
    TemplateFiltersComponent,
    TemplateListComponent,
    TemplateOsContainerComponent,
    TemplateOsIconContainerComponent,
    TemplateOsComponent,
    TemplateOsIconComponent,
    TemplateCardListComponent,
    TemplatePageContainerComponent,
    TemplateFilterContainerComponent,
    IsoAttachmentFilterSelectorContainerComponent,
    TemplateFilterListContainerComponent,
    TemplateFilterListComponent,
    TemplateFilterListSelectorComponent,
    TemplateFilterListSelectorContainerComponent,
    TemplateGroupSelectorContainerComponent,
    TemplateGroupSelectorComponent,
    TemplateGroupContainerComponent,
    TemplateGroupComponent,
    TemplatePageComponent,
    TemplateTagsComponent,
    TagsContainerComponent,
    TemplateZonesComponent,
    IsoZonesComponent,
    IsoZonesContainerComponent,
    TemplateZonesContainerComponent,
    TemplateDetailsComponent,
    IsoDetailsComponent,
    DetailsContainerComponent,
  ],
  exports: [
    TemplateFilterListSelectorContainerComponent,
    TemplateFilterListSelectorComponent,
    TemplateFilterListContainerComponent,
    IsoAttachmentFilterSelectorContainerComponent,
    TemplateFilterListComponent,
    TemplateFiltersComponent,
    TemplateGroupComponent
  ],
  providers: [
    IsoService,
    TemplateService,
    TemplateGroupService,
    TemplateActionsService,
    IsoActionsService,
    TemplateCreateAction,
    TemplateDeleteAction,
    IsoCreateAction,
    IsoDeleteAction
  ],
  entryComponents: [
    IsoAttachmentComponent,
    TemplateCreationContainerComponent,
    TemplateGroupSelectorContainerComponent,
  ]
})
export class TemplateModule {
}
