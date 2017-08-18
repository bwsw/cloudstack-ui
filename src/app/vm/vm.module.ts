import { MdlModule } from '@angular-mdl/core';
import { MdlSelectModule } from '@angular-mdl/select';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
    MdSelectModule,
    MdTooltipModule,
    MdMenuModule,
    MdButtonModule,
    MdIconModule,
    MdDialogModule,
    MdTabsModule
} from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';
import { DynamicModule } from 'ng-dynamic-component';
import { ServiceOfferingModule } from '../service-offering/service-offering.module';
import { DraggableSelectModule } from '../shared/components/draggable-select/draggable-select.module';
import { SharedModule } from '../shared/shared.module';
// tslint:disable-next-line
import { SnapshotModule } from '../snapshot/snapshot.module';
import { SpareDriveActionsService } from '../spare-drive/spare-drive-actions.service';
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
import { SshKeypairResetComponent } from './vm-sidebar/ssh/ssh-keypair-reset.component';
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
import { VmDetailComponent } from './vm-sidebar/vm-detail.component';
import { VmSidebarComponent } from './vm-sidebar/vm-sidebar.component';
import { VolumeResizeComponent } from './vm-sidebar/volume-resize.component';
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
    vmRouting,
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
    SnapshotsComponent,
    SpareDriveAttachmentDetailComponent,
    SpareDriveAttachmentDialogComponent,
    StorageDetailComponent,
    SshKeypairResetComponent,
    VmListComponent,
    VmColorComponent,
    VmCreationComponent,
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
    SpareDriveActionsService,
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
