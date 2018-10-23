import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { DynamicModule } from 'ng-dynamic-component';

import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../material/material.module';
import { DraggableSelectModule } from '../shared/components/draggable-select/draggable-select.module';
import { SnapshotModule } from '../snapshot/snapshot.module';

import { SnapshotEffects } from '../reducers/snapshots/redux/snapshot.effects';
import { snapshotReducers } from '../reducers/snapshots/redux/snapshot.reducers';
import { VolumeFilterComponent } from './volume-filter/volume-filter.component';
import { VolumeListComponent } from './volume-list/volume-list.component';
import { VolumePageComponent } from './volume-page/volume-page.component';
import { VolumeActionsSidebarComponent } from './volume-sidebar/actions-sidebar/volume-actions-sidebar.component';
// tslint:disable-next-line
import { VolumeSidebarDiskOfferingComponent } from './volume-sidebar/details/disk-offering/volume-sidebar-disk-offering.component';
import { VolumeSidebarVolumeComponent } from './volume-sidebar/details/volume/volume-sidebar-volume.component';
// tslint:disable-next-line
import { VolumeSnapshotCreationComponent } from './volume-sidebar/snapshot-details/snapshot-creation/volume-snapshot-creation.component';
import { VolumeSnapshotComponent } from './volume-sidebar/snapshot-details/snapshot/volume-snapshot.component';
import { VolumeSnapshotDetailsComponent } from './volume-sidebar/snapshot-details/volume-snapshot-details.component';
import { VolumeSidebarComponent } from './volume-sidebar/volume-sidebar.component';
import { volumeReducers } from '../reducers/volumes/redux/volumes.reducers';
import { VolumePageContainerComponent } from './container/volume.container';
import { VolumesEffects } from '../reducers/volumes/redux/volumes.effects';
import { zoneReducers } from '../reducers/zones/redux/zones.reducers';
import { ZonesEffects } from '../reducers/zones/redux/zones.effects';
import { VolumeFilterContainerComponent } from './container/volume-filter.container';
import { VolumeSidebarContainerComponent } from './container/volume-sidebar.container';
import { VolumeDetailsContainerComponent } from './container/volume-details.container';
import { diskOfferingReducers } from '../reducers/disk-offerings/redux/disk-offerings.reducers';
import { DiskOfferingEffects } from '../reducers/disk-offerings/redux/disk-offerings.effects';
import { VolumeCreationComponent } from './volume-creation/volume-creation.component';
import { VolumeCreationDialogComponent } from './volume-creation/volume-creation-dialog.component';
import { VolumeCreationContainerComponent } from './container/volume-creation.container';
import { VolumeCardItemComponent } from './volume-item/card-item/volume-card-item.component';
import { VolumeRowItemComponent } from './volume-item/row-item/volume-row-item.component';
import { userAccountReducers } from '../reducers/auth/redux/auth.reducers';
import { UserAccountEffects } from '../reducers/auth/redux/auth.effects';
import { VolumeSnapshotDetailsContainerComponent } from './container/volume-snapshot-details.container';
import { virtualMachineReducers } from '../reducers/vm/redux/vm.reducers';
import { VolumeGroupedListComponent } from './volume-list/volume-grouped-list.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MaterialModule,
    DynamicModule.withComponents([VolumeCardItemComponent, VolumeRowItemComponent]),
    RouterModule,
    SnapshotModule,
    DraggableSelectModule,
    StoreModule.forFeature('volumes', volumeReducers),
    StoreModule.forFeature('virtualMachines', virtualMachineReducers),
    StoreModule.forFeature('userAccount', userAccountReducers),
    StoreModule.forFeature('zones', zoneReducers),
    StoreModule.forFeature('disk-offerings', diskOfferingReducers),
    StoreModule.forFeature('snapshots', snapshotReducers),
    EffectsModule.forFeature([
      VolumesEffects,
      ZonesEffects,
      DiskOfferingEffects,
      UserAccountEffects,
      SnapshotEffects,
    ]),
  ],
  declarations: [
    VolumeSnapshotComponent,
    VolumeSnapshotCreationComponent,
    VolumeSnapshotDetailsComponent,
    VolumeSnapshotDetailsContainerComponent,
    VolumeActionsSidebarComponent,
    VolumePageComponent,
    VolumePageContainerComponent,
    VolumeSidebarContainerComponent,
    VolumeDetailsContainerComponent,
    VolumeFilterContainerComponent,
    VolumeSidebarComponent,
    VolumeSidebarDiskOfferingComponent,
    VolumeSidebarVolumeComponent,
    VolumeCreationComponent,
    VolumeCreationContainerComponent,
    VolumeFilterComponent,
    VolumeCreationDialogComponent,
    VolumeCardItemComponent,
    VolumeRowItemComponent,
    VolumeListComponent,
    VolumeGroupedListComponent,
  ],
  exports: [VolumePageComponent],
  entryComponents: [VolumeCreationComponent, VolumeCreationContainerComponent],
})
export class VolumeModule {}
