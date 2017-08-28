import { MdlModule } from '@angular-mdl/core';
import { MdlSelectModule } from '@angular-mdl/select';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MdButtonModule,
  MdCheckboxModule,
  MdDialogModule,
  MdIconModule,
  MdMenuModule,
  MdSelectModule,
  MdTabsModule,
  MdTooltipModule
} from '@angular/material';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { DynamicModule } from 'ng-dynamic-component';

import { routes } from '../app.routing';
import { PulseModule } from '../pulse/pulse.module';
import { ServiceOfferingModule } from '../service-offering/service-offering.module';
import { DraggableSelectModule } from '../shared/components/draggable-select/draggable-select.module';
import { SharedModule } from '../shared/shared.module';
// tslint:disable-next-line
import { SnapshotModule } from '../snapshot/snapshot.module';
import { TagsModule } from '../tags/tags.module';
import { TemplateModule } from '../template';
import { VmActionsService } from './shared/vm-actions.service';
import { VmEntityDeletionService } from './shared/vm-entity-deletion.service';
import { VmService } from './shared/vm.service';
import { VmActionProviders } from './vm-actions/index';
import { VmCreationFormNormalizationService } from './vm-creation/form-normalization/form-normalization.service';
import { KeyboardsComponent } from './vm-creation/keyboards/keyboards.component';
import { VmCreationService } from './vm-creation/services/vm-creation.service';
import { VmDeploymentService } from './vm-creation/services/vm-deployment.service';
import { VmTemplateDialogComponent } from './vm-creation/template/vm-template-dialog.component';
import { VmTemplateComponent } from './vm-creation/template/vm-template.component';
import { VmCreationDialogComponent } from './vm-creation/vm-creation-dialog.component';
import { VmCreationComponent } from './vm-creation/vm-creation.component';
import { VmFilterComponent } from './vm-filter/vm-filter.component';
import { VmListItemComponent } from './vm-list/vm-list-item.component';
import { VmListComponent } from './vm-list/vm-list.component';
import { AffinityGroupSelectorComponent } from './vm-sidebar/affinity-group-selector/affinity-group-selector.component';
import { VmColorComponent } from './vm-sidebar/color/vm-color.component';
import { InstanceGroupSelectorComponent } from './vm-sidebar/instance-group-selector/instance-group-selector.component';
import { InstanceGroupComponent } from './vm-sidebar/instance-group/instance-group.component';
// tslint:disable-next-line
import { FirewallRulesDetailComponent } from './vm-sidebar/network-detail/firewall-rules/firewall-rules-detail.component';
import { NetworkDetailComponent } from './vm-sidebar/network-detail/network-detail.component';
import { NicDetailComponent } from './vm-sidebar/network-detail/nic/nic-detail.component';
// tslint:disable-next-line
import { ServiceOfferingDetailsComponent } from './vm-sidebar/service-offering-details/service-offering-details.component';
import { SshKeypairResetComponent } from './vm-sidebar/ssh/ssh-keypair-reset.component';
import { StatisticsComponent } from './vm-sidebar/statistics/statistics.component';
import { IsoComponent } from './vm-sidebar/storage-detail/iso.component';
// tslint:disable-next-line
import { SpareDriveAttachmentDetailComponent } from './vm-sidebar/storage-detail/spare-drive-attachment/spare-drive-attachment-detail/spare-drive-attachment-detail.component';
// tslint:disable-next-line
import { SpareDriveAttachmentDialogComponent } from './vm-sidebar/storage-detail/spare-drive-attachment/spare-drive-attchment-dialog/spare-drive-attachment-dialog.component';
import { StorageDetailComponent } from './vm-sidebar/storage-detail/storage-detail.component';
// tslint:disable-next-line
import { SnapshotCreationComponent } from './vm-sidebar/storage-detail/volume/snapshot-creation/snapshot-creation.component';
import { SnapshotActionsService } from './vm-sidebar/storage-detail/volume/snapshot/snapshot-actions.service';
import { SnapshotModalComponent } from './vm-sidebar/storage-detail/volume/snapshot/snapshot-modal.component';
import { SnapshotsComponent } from './vm-sidebar/storage-detail/volume/snapshot/snapshots.component';
import { VolumeDetailsComponent } from './vm-sidebar/storage-detail/volume/volume-details/volume-details.component';
import { VolumeComponent } from './vm-sidebar/storage-detail/volume/volume.component';
import { VmDetailTemplateComponent } from './vm-sidebar/template/vm-detail-template.component';
import { VmDetailComponent } from './vm-sidebar/vm-detail/vm-detail.component';
import { VmSidebarComponent } from './vm-sidebar/vm-sidebar.component';
import { VolumeResizeComponent } from './vm-sidebar/volume-resize/volume-resize.component';
import { VmDetailZoneComponent } from './vm-sidebar/zone/zone.component';
import { VmTagsComponent } from './vm-tags/vm-tags.component';
import { vmRouting } from './vm.routing';
import { WebShellService } from './web-shell/web-shell.service';


@NgModule({
  imports: [
    CommonModule,
    DynamicModule.withComponents([VmListItemComponent]),
    FormsModule,
    ServiceOfferingModule,
    DraggableSelectModule,
    MdCheckboxModule,
    MdTooltipModule,
    MdSelectModule,
    MdlModule,
    MdDialogModule,
    MdlSelectModule,
    ReactiveFormsModule,
    ServiceOfferingModule,
    ServiceOfferingModule,
    SharedModule,
    SnapshotModule,
    TagsModule,
    TemplateModule,
    TranslateModule,
    TranslateModule,
    PulseModule,
    vmRouting,
    RouterModule.forRoot(routes),
    MdMenuModule,
    MdButtonModule,
    MdIconModule,
    MdTabsModule,
  ],
  declarations: [
    AffinityGroupSelectorComponent,
    KeyboardsComponent,
    FirewallRulesDetailComponent,
    NetworkDetailComponent,
    NicDetailComponent,
    ServiceOfferingDetailsComponent,
    SnapshotsComponent,
    SpareDriveAttachmentDetailComponent,
    SpareDriveAttachmentDialogComponent,
    StatisticsComponent,
    StorageDetailComponent,
    SshKeypairResetComponent,
    VmDetailTemplateComponent,
    VmDetailZoneComponent,
    VmListComponent,
    VmColorComponent,
    VmCreationComponent,
    VmCreationDialogComponent,
    VmListItemComponent,
    VmDetailComponent,
    VmFilterComponent,
    VmSidebarComponent,
    VmTemplateComponent,
    VmTemplateDialogComponent,
    VolumeDetailsComponent,
    VolumeResizeComponent,
    InstanceGroupComponent,
    InstanceGroupSelectorComponent,
    IsoComponent,
    VmTagsComponent,
    VolumeComponent,
    SnapshotCreationComponent,
    SnapshotModalComponent,
  ],
  providers: [
    VmActionsService,
    VmCreationFormNormalizationService,
    VmCreationService,
    VmDeploymentService,
    VmEntityDeletionService,
    VmService,
    WebShellService,
    SnapshotActionsService,
    ...VmActionProviders
  ],
  entryComponents: [
    AffinityGroupSelectorComponent,
    InstanceGroupSelectorComponent,
    VmCreationComponent,
    VmTemplateDialogComponent,
    VolumeResizeComponent,
    SnapshotCreationComponent,
    SnapshotModalComponent,
    SpareDriveAttachmentDialogComponent,
    SshKeypairResetComponent
  ]
})
export class VmModule { }
