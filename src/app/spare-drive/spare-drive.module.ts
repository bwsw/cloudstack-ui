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
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { DynamicModule } from 'ng-dynamic-component';
// tslint:disable-next-line
import { SpareDriveAttachmentComponent } from '../shared/actions/volume-actions/volume-attachment/volume-attachment.component';
import { SharedModule } from '../shared/shared.module';
import { SpareDriveCreationDialogComponent } from './volume-creation/volume-creation-dialog.component';
import { SpareDriveCreationComponent } from './volume-creation/volume-creation.component';
import { SpareDriveFilterComponent } from './volume-filter/volume-filter.component';
import { SpareDriveItemComponent } from './volume-item/volume-item.component';
import { SpareDriveListComponent } from './volume-list/volume-list.component';
import { SpareDrivePageComponent } from './volume-page/volume-page.component';
// tslint:disable-next-line
import { SpareDriveActionsSidebarComponent } from './volume-sidebar/actions-sidebar/volume-actions-sidebar.component';
// tslint:disable-next-line
import { SpareDriveSidebarDiskOfferingComponent } from './volume-sidebar/details/disk-offering/volume-sidebar-disk-offering.component';
import { SpareDriveDetailsComponent } from './volume-sidebar/details/volume-details.component';
// tslint:disable-next-line
import { SpareDriveSidebarVolumeComponent } from './volume-sidebar/details/volume/volume-sidebar-volume.component';
// tslint:disable-next-line
import { SpareDriveSnapshotCreationComponent } from './volume-sidebar/snapshot-details/snapshot-creation/volume-snapshot-creation.component';
import { SnapshotActionsComponent } from './volume-sidebar/snapshot-details/snapshot/snapshot-actions/snapshot-actions.component';
// tslint:disable-next-line
import { SpareDriveSnapshotComponent } from './volume-sidebar/snapshot-details/snapshot/volume-snapshot.component';
// tslint:disable-next-line
import { SpareDriveSnapshotDetailsComponent } from './volume-sidebar/snapshot-details/volume-snapshot-details.component';
import { SpareDriveSidebarComponent } from './volume-sidebar/volume-sidebar.component';
import { DraggableSelectModule } from '../shared/components/draggable-select/draggable-select.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    DynamicModule.withComponents([SpareDriveItemComponent]),
    MdButtonModule,
    MdCheckboxModule,
    MdDialogModule,
    MdIconModule,
    MdInputModule,
    MdMenuModule,
    MdSelectModule,
    MdTabsModule,
    MdTooltipModule,
    RouterModule,
    SharedModule,
    TranslateModule,
    MdDialogModule,
    DraggableSelectModule
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
