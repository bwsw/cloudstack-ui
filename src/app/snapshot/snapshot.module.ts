import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { DraggableSelectModule } from '../shared/components/draggable-select/draggable-select.module';
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../material/material.module';

import { DayOfWeekComponent } from './recurring-snapshots/day-of-week/day-of-week.component';
import { DailyPolicyComponent } from './recurring-snapshots/policy-editor/daily/daily-policy.component';
import { HourlyPolicyComponent } from './recurring-snapshots/policy-editor/hourly/hourly-policy.component';
import { MonthlyPolicyComponent } from './recurring-snapshots/policy-editor/monthly/monthly-policy.component';
import { PolicyEditorComponent } from './recurring-snapshots/policy-editor/policy-editor.component';
import { WeeklyPolicyComponent } from './recurring-snapshots/policy-editor/weekly/weekly-policy.component';
import { PolicyListComponent } from './recurring-snapshots/policy-list/policy-list.component';
import { PolicyViewBuilderService } from './recurring-snapshots/policy-list/policy-view-builder.service';
import { RecurringSnapshotsComponent } from './recurring-snapshots/recurring-snapshots.component';
import { SnapshotPolicyService } from './recurring-snapshots/snapshot-policy.service';
import { StoredNumberComponent } from './recurring-snapshots/stored-number/stored-number.component';
import { CreateVolumeFromSnapshotComponent } from './snapshots-page/components/create-volume/create-volume.component';
// tslint:disable-next-line
import { CreateVolumeFromSnapshotContainerComponent } from './snapshots-page/components/create-volume/create-volume.container';
import { SnapshotFilterComponent } from './snapshots-page/snapshot-filter/snapshot-filter.component';
import { SnapshotFilterContainerComponent } from './snapshots-page/snapshot-filter/snapshot-filter.container';
// tslint:disable-next-line
import { SnapshotActionComponent } from './snapshots-page/snapshot-list-item/snapshot-actions/snapshot-action.component';
// tslint:disable-next-line
import { SnapshotActionContainerComponent } from './snapshots-page/snapshot-list-item/snapshot-actions/snapshot-action.container';
import { SnapshotActionService } from './snapshots-page/snapshot-list-item/snapshot-actions/snapshot-action.service';
import { SnapshotCardItemComponent } from './snapshots-page/snapshot-list-item/snapshot-card-item.component';
import { SnapshotListItemComponent } from './snapshots-page/snapshot-list-item/snapshot-list-item.component';
import { SnapshotSidebarComponent } from './snapshots-page/snapshot-sidebar/snapshot-sidebar.component';
import { SnapshotSidebarContainerComponent } from './snapshots-page/snapshot-sidebar/snapshot-sidebar.container';
import { SnapshotsPageComponent } from './snapshots-page/snapshots-page.component';
import { SnapshotsPageContainerComponent } from './snapshots-page/snapshots-page.container';

@NgModule({
  imports: [CommonModule, SharedModule, MaterialModule, DraggableSelectModule, RouterModule],
  exports: [RecurringSnapshotsComponent, SnapshotActionContainerComponent],
  declarations: [
    DayOfWeekComponent,
    HourlyPolicyComponent,
    DailyPolicyComponent,
    WeeklyPolicyComponent,
    MonthlyPolicyComponent,
    PolicyEditorComponent,
    PolicyListComponent,
    RecurringSnapshotsComponent,
    StoredNumberComponent,
    SnapshotsPageContainerComponent,
    SnapshotsPageComponent,
    SnapshotListItemComponent,
    SnapshotCardItemComponent,
    SnapshotActionContainerComponent,
    SnapshotActionComponent,
    SnapshotFilterContainerComponent,
    SnapshotFilterComponent,
    SnapshotSidebarContainerComponent,
    SnapshotSidebarComponent,
    CreateVolumeFromSnapshotContainerComponent,
    CreateVolumeFromSnapshotComponent,
  ],
  providers: [PolicyViewBuilderService, SnapshotPolicyService, SnapshotActionService],
  entryComponents: [
    RecurringSnapshotsComponent,
    SnapshotCardItemComponent,
    SnapshotListItemComponent,
    SnapshotActionContainerComponent,
    CreateVolumeFromSnapshotContainerComponent,
  ],
})
export class SnapshotModule {}
