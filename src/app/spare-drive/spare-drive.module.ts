import { MdlModule } from '@angular-mdl/core';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MdButtonModule,
  MdCheckboxModule,
  MdDialogModule,
  MdIconModule,
  MdInputModule,
  MdMenuModule,
  MdSelectModule,
  MdTabsModule,
  MdTooltipModule
} from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';
import { DynamicModule } from 'ng-dynamic-component';
import { SpareDriveAttachmentComponent } from '../shared/actions/spare-drive-actions/spare-drive-attachment/spare-drive-attachment.component';
import { SharedModule } from '../shared/shared.module';
import { SpareDriveCreationDialogComponent } from './spare-drive-creation/spare-drive-creation-dialog.component';
import { SpareDriveCreationComponent } from './spare-drive-creation/spare-drive-creation.component';
import { SpareDriveFilterComponent } from './spare-drive-filter/spare-drive-filter.component';
import { SpareDriveItemComponent } from './spare-drive-item/spare-drive-item.component';
import { SpareDriveListComponent } from './spare-drive-list/spare-drive-list.component';
import { SpareDrivePageComponent } from './spare-drive-page/spare-drive-page.component';
import { SpareDriveActionsSidebarComponent } from './spare-drive-sidebar/actions-sidebar/spare-drive-actions-sidebar.component';
import { SpareDriveSidebarDiskOfferingComponent } from './spare-drive-sidebar/details/disk-offering/spare-drive-sidebar-disk-offering.component';
import { SpareDriveDetailsComponent } from './spare-drive-sidebar/details/spare-drive-details.component';
import { SpareDriveSidebarVolumeComponent } from './spare-drive-sidebar/details/volume/spare-drive-sidebar-volume.component';
import { SpareDriveSnapshotCreationComponent } from './spare-drive-sidebar/snapshot-details/snapshot-creation/spare-drive-snapshot-creation.component';
import { SnapshotActionsComponent } from './spare-drive-sidebar/snapshot-details/snapshot/snapshot-actions/snapshot-actions.component';
import { SpareDriveSnapshotComponent } from './spare-drive-sidebar/snapshot-details/snapshot/spare-drive-snapshot.component';
import { SpareDriveSnapshotDetailsComponent } from './spare-drive-sidebar/snapshot-details/spare-drive-snapshot-details.component';
import { SpareDriveSidebarComponent } from './spare-drive-sidebar/spare-drive-sidebar.component';
import { spareDrivesRouting } from './spare-drive.routing';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    MdCheckboxModule,
    MdSelectModule,
    MdTooltipModule,
    MdlModule,
    SharedModule,
    spareDrivesRouting,
    DynamicModule.withComponents([SpareDriveItemComponent]),
    MdMenuModule,
    MdButtonModule,
    MdIconModule,
    MdTabsModule,
    MdDialogModule,
    MdInputModule
  ],
  declarations: [
    SnapshotActionsComponent,
    SpareDriveDetailsComponent,
    SpareDriveSnapshotComponent,
    SpareDriveSnapshotCreationComponent,
    SpareDriveSnapshotDetailsComponent,
    SpareDriveActionsSidebarComponent,
    SpareDrivePageComponent,
    SpareDriveSidebarComponent,
    SpareDriveSidebarDiskOfferingComponent,
    SpareDriveSidebarVolumeComponent,
    SpareDriveAttachmentComponent,
    SpareDriveCreationComponent,
    SpareDriveFilterComponent,
    SpareDriveCreationDialogComponent,
    SpareDriveItemComponent,
    SpareDriveListComponent
  ],
  exports: [
    SpareDrivePageComponent
  ],
  entryComponents: [
    SpareDriveCreationComponent
  ]
})
export class SpareDriveModule { }
