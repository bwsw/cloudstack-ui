import { MdlModule } from '@angular-mdl/core';
import { MdlPopoverModule } from '@angular-mdl/popover';
import { MdlSelectModule } from '@angular-mdl/select';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { routes } from '../app.routing';

import { ServiceOfferingModule } from '../service-offering/service-offering.module';
import { SharedModule } from '../shared/shared.module';
import { TemplateModule } from '../template';
import { VmService } from './shared/vm.service';
import { VmCreationFormNormalizationService } from './vm-creation/form-normalization/form-normalization.service';
import { KeyboardsComponent } from './vm-creation/keyboards/keyboards.component';
import { VmTemplateDialogComponent } from './vm-creation/template/vm-template-dialog.component';
import { VmTemplateComponent } from './vm-creation/template/vm-template.component';
import { VmCreationComponent } from './vm-creation/vm-creation.component';
import { VmCreationService } from './vm-creation/vm-creation.service';
import { VmDeploymentService } from './vm-creation/vm-deployment.service';
import { VmFilterComponent } from './vm-filter/vm-filter.component';
import { VmListItemComponent } from './vm-list/vm-list-item.component';
import { VmListSectionComponent } from './vm-list/vm-list-section/vm-list-section.component';
import { VmListSubsectionComponent } from './vm-list/vm-list-subsection/vm-list-subsection.component';
import { VmListComponent } from './vm-list/vm-list.component';
import { AffinityGroupDialogComponent } from './vm-sidebar/affinity-group-dialog.component';
import { InstanceGroupSelectorComponent } from './vm-sidebar/instance-group-selector/instance-group-selector.component';
import { InstanceGroupComponent } from './vm-sidebar/instance-group/instance-group.component';
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
import { vmRouting } from './vm.routing';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MdlModule,
    MdlPopoverModule,
    MdlSelectModule,
    ReactiveFormsModule,
    ServiceOfferingModule,
    SharedModule,
    TemplateModule,
    TranslateModule,
    TranslateModule,
    vmRouting,
    RouterModule.forRoot(routes),
  ],
  declarations: [
    AffinityGroupDialogComponent,
    KeyboardsComponent,
    SnapshotsComponent,
    SpareDriveAttachmentDetailComponent,
    SpareDriveAttachmentDialogComponent,
    StorageDetailComponent,
    SshKeypairResetComponent,
    VmListComponent,
    VmCreationComponent,
    VmListItemComponent,
    VmDetailComponent,
    VmFilterComponent,
    VmSidebarComponent,
    VmTemplateComponent,
    VmTemplateDialogComponent,
    VmListSectionComponent,
    VmListSubsectionComponent,
    VolumeDetailsComponent,
    VolumeResizeComponent,
    InstanceGroupComponent,
    InstanceGroupSelectorComponent,
    IsoComponent,
    VolumeComponent,
    SnapshotCreationComponent,
    SnapshotModalComponent,
  ],
  providers: [
    VmCreationFormNormalizationService,
    VmCreationService,
    VmDeploymentService,
    VmService,
    SnapshotActionsService
  ],
  entryComponents: [
    AffinityGroupDialogComponent,
    InstanceGroupSelectorComponent,
    VmCreationComponent,
    VmTemplateDialogComponent,
    VolumeResizeComponent,
    SnapshotCreationComponent,
    SnapshotModalComponent,
    SpareDriveAttachmentDialogComponent,
    SshKeypairResetComponent,
  ]
})
export class VmModule { }
