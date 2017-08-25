import { MdlModule } from '@angular-mdl/core';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MdButtonModule,
  MdCheckboxModule,
  MdIconModule,
  MdMenuModule,
  MdSelectModule,
  MdTabsModule,
  MdTooltipModule
} from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';
import { DynamicModule } from 'ng-dynamic-component';
import { SharedModule } from '../shared/shared.module';
import { SpareDriveActionsService } from './spare-drive-actions.service';
import { SpareDriveActionsComponent } from './spare-drive-actions/spare-drive-actions-component/spare-drive-actions.component';
import { SpareDriveAttachAction } from './spare-drive-actions/spare-drive-attach';
import { SpareDriveDetachAction } from './spare-drive-actions/spare-drive-detach';
import { SpareDriveRemoveAction } from './spare-drive-actions/spare-drive-remove';
import { SpareDriveResizeAction } from './spare-drive-actions/spare-drive-resize';
import { SpareDriveAttachmentComponent } from './spare-drive-attachment/spare-drive-attachment.component';
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
    MdTabsModule
  ],
  declarations: [
    SpareDriveDetailsComponent,
    SpareDriveSnapshotComponent,
    SpareDriveSnapshotCreationComponent,
    SpareDriveSnapshotDetailsComponent,
    SpareDriveActionsComponent,
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
    SpareDriveAttachmentComponent,
    SpareDriveCreationComponent
  ],
  providers: [
    SpareDriveActionsService,
    SpareDriveAttachAction,
    SpareDriveDetachAction,
    SpareDriveResizeAction,
    SpareDriveRemoveAction
  ]
})
export class SpareDriveModule { }
