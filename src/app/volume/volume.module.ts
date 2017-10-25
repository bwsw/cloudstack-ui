import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatCheckboxModule,
  MatDialogModule,
  MatIconModule,
  MatInputModule,
  MatMenuModule,
  MatSelectModule,
  MatTabsModule,
  MatTooltipModule
} from '@angular/material';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { DynamicModule } from 'ng-dynamic-component';
// tslint:disable-next-line
import { SharedModule } from '../shared/shared.module';
import { VolumeCreationDialogComponent } from './volume-creation/volume-creation-dialog.component';
import { VolumeCreationComponent } from './volume-creation/volume-creation.component';
import { VolumeFilterComponent } from './volume-filter/volume-filter.component';
import { VolumeItemComponent } from './volume-item/volume-item.component';
import { VolumeListComponent } from './volume-list/volume-list.component';
import { VolumePageComponent } from './volume-page/volume-page.component';
// tslint:disable-next-line
import { VolumeActionsSidebarComponent } from './volume-sidebar/actions-sidebar/volume-actions-sidebar.component';
// tslint:disable-next-line
import { VolumeSidebarDiskOfferingComponent } from './volume-sidebar/details/disk-offering/volume-sidebar-disk-offering.component';
import { VolumeDetailsComponent } from './volume-sidebar/details/volume-details.component';
// tslint:disable-next-line
import { VolumeSidebarVolumeComponent } from './volume-sidebar/details/volume/volume-sidebar-volume.component';
// tslint:disable-next-line
import { VolumeSnapshotCreationComponent } from './volume-sidebar/snapshot-details/snapshot-creation/volume-snapshot-creation.component';
import { SnapshotActionsComponent } from './volume-sidebar/snapshot-details/snapshot/snapshot-actions/snapshot-actions.component';
// tslint:disable-next-line
import { VolumeSnapshotComponent } from './volume-sidebar/snapshot-details/snapshot/volume-snapshot.component';
// tslint:disable-next-line
import { VolumeSnapshotDetailsComponent } from './volume-sidebar/snapshot-details/volume-snapshot-details.component';
import { VolumeSidebarComponent } from './volume-sidebar/volume-sidebar.component';
import { DraggableSelectModule } from '../shared/components/draggable-select/draggable-select.module';
// tslint:disable-next-line
// tslint:disable-next-line
import { VolumeAttachmentComponent } from '../shared/actions/volume-actions/volume-attachment/volume-attachment.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    DynamicModule.withComponents([VolumeItemComponent]),
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatSelectModule,
    MatTabsModule,
    MatTooltipModule,
    RouterModule,
    SharedModule,
    TranslateModule,
    MatDialogModule,
    DraggableSelectModule
  ],
  declarations: [
    SnapshotActionsComponent,
    VolumeDetailsComponent,
    VolumeSnapshotComponent,
    VolumeSnapshotCreationComponent,
    VolumeSnapshotDetailsComponent,
    VolumeActionsSidebarComponent,
    VolumePageComponent,
    VolumeSidebarComponent,
    VolumeSidebarDiskOfferingComponent,
    VolumeSidebarVolumeComponent,
    VolumeAttachmentComponent,
    VolumeCreationComponent,
    VolumeFilterComponent,
    VolumeCreationDialogComponent,
    VolumeItemComponent,
    VolumeListComponent
  ],
  exports: [
    VolumePageComponent
  ],
  entryComponents: [
    VolumeCreationComponent
  ]
})
export class VolumeModule { }
