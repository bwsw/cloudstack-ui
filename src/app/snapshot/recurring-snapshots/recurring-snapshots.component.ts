import { Component, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { SgRulesManagerComponent } from '../../shared/components/sg-rules-manager.component';


export enum RecurringSnapshotPolicy {
  Hourly,
  Daily,
  Weekly,
  Monthly
}

export const enum DayPeriod {
  Am,
  Pm
}

const enum DayOfWeek {
  Monday,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
  Saturday,
  Sunday
}

const enum TimeZone { }

export abstract class AbstractPolicy {
  public timeZone: TimeZone;
  public storedSnapshots: number;
}

export class HourlyPolicy extends AbstractPolicy {
  public minute: number;
}

export class DailyPolicy extends AbstractPolicy {
  public time: Time;
}

export class WeeklyPolicy extends DailyPolicy {
  public dayOfWeek: DayOfWeek;
}

export class MonthlyPolicy extends DailyPolicy {
  public dayOfMonth: number;
}

interface Time {
  hours: number;
  minutes: number;
  seconds: number;
  amPm: DayPeriod;
}

@Component({
  selector: 'recurring-snapshots',
  templateUrl: 'recurring-snapshots.component.html',
  styleUrls: ['recurring-snapshots.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SgRulesManagerComponent),
      multi: true
    }
  ]
})
export class RecurringSnapshotsComponent {
  public currentPolicy: RecurringSnapshotPolicy;

  public hourlyPolicy: HourlyPolicy;
  public dailyPolicy: DailyPolicy;
  public weeklyPolicy: WeeklyPolicy;
  public monthlyPolicy: MonthlyPolicy;

  public ngOnInit(): void {
    this.currentPolicy = RecurringSnapshotPolicy.Hourly;
  }

  public tabChanged(tab): void {
    this.currentPolicy = tab.index;
  }
}
