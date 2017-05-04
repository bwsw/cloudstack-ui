import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MdlModule } from 'angular2-mdl';
import { MdlPopoverModule } from '@angular2-mdl-ext/popover';
import { MdlSelectModule } from '@angular2-mdl-ext/select';

import { ServiceOfferingModule } from '../service-offering/service-offering.module';
import { SharedModule } from '../shared/shared.module';
import { StorageDetailComponent } from './vm-sidebar/storage-detail/storage-detail.component';
import { TemplateModule } from '../template';
import { VmCreationComponent } from './vm-creation/vm-creation.component';
import { VmDetailComponent } from './vm-sidebar/vm-detail.component';
import { VmListComponent } from './vm-list/vm-list.component';
import { VmListItemComponent } from './vm-list/vm-list-item.component';
import { VmSidebarComponent } from './vm-sidebar/vm-sidebar.component';
import { VmService } from './shared/vm.service';
import { VmTemplateComponent } from './vm-creation/vm-creation-template/vm-template.component';
import { VmTemplateDialogComponent } from './vm-creation/vm-creation-template/vm-template-dialog.component';
import { VolumeResizeComponent } from './vm-sidebar/volume-resize.component';
import { IsoComponent } from './vm-sidebar/storage-detail/iso.component';
import { VolumeComponent } from './vm-sidebar/storage-detail/volume/volume.component';
import {
  SnapshotCreationComponent
} from './vm-sidebar/storage-detail/volume/snapshot-creation/snapshot-creation.component';
import { VmFilterComponent } from './vm-filter/vm-filter.component';
import { VmListSectionComponent } from './vm-list/vm-list-section/vm-list-section.component';
import { VmListSubsectionComponent } from './vm-list/vm-list-subsection/vm-list-subsection.component';
import { SnapshotModalComponent } from './vm-sidebar/storage-detail/volume/snapshot/snapshot-modal.component';
import { SnapshotActionsService } from './vm-sidebar/storage-detail/volume/snapshot/snapshot-actions.service';
import { SpareDriveAttachmentComponent } from './vm-sidebar/storage-detail/spare-drive-attachment/spare-drive-attachment.component';
import { SpareDriveAttachmentDialogComponent } from './vm-sidebar/storage-detail/spare-drive-attachment/spare-drive-attachment-dialog.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ServiceOfferingModule,
    MdlModule,
    MdlPopoverModule,
    MdlSelectModule,
    SharedModule,
    TemplateModule,
    TranslateModule
  ],
  declarations: [
    SpareDriveAttachmentDetailComponent,
    SpareDriveAttachmentDialogComponent,
    StorageDetailComponent,
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
    VolumeResizeComponent,
    IsoComponent,
    VolumeComponent,
    SnapshotCreationComponent,
    SnapshotModalComponent
  ],
  providers: [
    VmService,
    SnapshotActionsService
  ],
  entryComponents: [
    VmCreationComponent,
    VmTemplateDialogComponent,
    VolumeResizeComponent,
    SnapshotCreationComponent,
    SnapshotModalComponent
  ]
})
export class VmModule { }
