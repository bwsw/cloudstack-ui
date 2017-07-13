import { MdlModule } from '@angular-mdl/core';
import { MdlSelectModule } from '@angular-mdl/select';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../shared/shared.module';
import { DayOfWeekComponent } from './recurring-snapshots/day-of-week/day-of-week.component';
import { DayPeriodComponent } from './recurring-snapshots/day-period/day-period.component';
import { DailyPolicyComponent } from './recurring-snapshots/policy/daily/daily-policy.component';
import { HourlyPolicyComponent } from './recurring-snapshots/policy/hourly/hourly-policy.component';
import { MonthlyPolicyComponent } from './recurring-snapshots/policy/monthly/monthly-policy.component';
import { PolicyComponent } from './recurring-snapshots/policy/policy.component';
import { WeeklyPolicyComponent } from './recurring-snapshots/policy/weekly/weekly-policy.component';
import { RecurringSnapshotsComponent } from './recurring-snapshots/recurring-snapshots.component';
import { StoredNumberComponent } from './recurring-snapshots/stored-number/stored-number.component';
import { TimeZoneComponent } from './recurring-snapshots/time-zone/time-zone.component';
import { TimeZoneService } from './recurring-snapshots/time-zone/time-zone.service';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    MdlModule,
    MdlSelectModule,
    SharedModule,
    ReactiveFormsModule
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
    PolicyComponent,
    RecurringSnapshotsComponent,
    StoredNumberComponent,
    TimeZoneComponent
  ],
  providers: [
    TimeZoneService
  ]
})
export class SnapshotModule { }
