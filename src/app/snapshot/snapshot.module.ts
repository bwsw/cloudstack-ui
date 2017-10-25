import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatDialogModule,
  MatIconModule,
  MatInputModule,
  MatSelectModule,
  MatTabsModule,
  MatTooltipModule
} from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../shared/shared.module';
import { DayOfWeekComponent } from './recurring-snapshots/day-of-week/day-of-week.component';
import { DayPeriodComponent } from './recurring-snapshots/day-period/day-period.component';
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
import { TimePickerComponent } from './recurring-snapshots/time-picker/time-picker.component';
import { TimeZoneComponent } from './recurring-snapshots/time-zone/time-zone.component';
import { TimeZoneService } from './recurring-snapshots/time-zone/time-zone.service';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    MatTooltipModule,
    MatSelectModule,
    MatInputModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatInputModule,
    SharedModule,
    ReactiveFormsModule,
    MatTabsModule,
  ],
  exports: [
    RecurringSnapshotsComponent
  ],
  declarations: [
    DayOfWeekComponent,
    DayPeriodComponent,
    HourlyPolicyComponent,
    DailyPolicyComponent,
    WeeklyPolicyComponent,
    MonthlyPolicyComponent,
    PolicyEditorComponent,
    PolicyListComponent,
    RecurringSnapshotsComponent,
    StoredNumberComponent,
    TimeZoneComponent,
    TimePickerComponent,
    PolicyListComponent
  ],
  providers: [
    PolicyViewBuilderService,
    SnapshotPolicyService,
    TimeZoneService
  ],
  entryComponents: [
    RecurringSnapshotsComponent
  ]
})
export class SnapshotModule { }
