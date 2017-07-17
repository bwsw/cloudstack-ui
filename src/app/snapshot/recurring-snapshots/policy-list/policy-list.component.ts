import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { DayOfWeek } from '../../../shared/types/day-of-week';
import { DailyPolicy } from '../policy-editor/daily/daily-policy.component';
import { HourlyPolicy } from '../policy-editor/hourly/hourly-policy.component';
import { MonthlyPolicy } from '../policy-editor/monthly/monthly-policy.component';
import { Policy, TimePolicy } from '../policy-editor/policy-editor.component';
import { WeeklyPolicy } from '../policy-editor/weekly/weekly-policy.component';
import { PolicyType } from '../recurring-snapshots.component';
import { Time } from '../time-picker/time-picker.component';


interface PolicyView {
  id: string;
  type: PolicyType;
  timeToken: string;
  timeValue: string;
  periodToken: string;
  periodValue: string;
  timeZone: string;
  keep: string;
}

@Component({
  selector: 'cs-policy-list',
  templateUrl: 'policy-list.component.html',
  styleUrls: ['policy-list.component.scss']
})
export class PolicyListComponent implements OnChanges {
  @Input() hourlyPolicy: Policy<HourlyPolicy>;
  @Input() dailyPolicy: Policy<DailyPolicy>;
  @Input() weeklyPolicy: Policy<WeeklyPolicy>;
  @Input() monthlyPolicy: Policy<MonthlyPolicy>;
  @Output() onPolicyDelete: EventEmitter<Policy<TimePolicy>>;

  public policies: Array<PolicyView>;

  constructor() {
    this.onPolicyDelete = new EventEmitter<Policy<TimePolicy>>();
  }

  public ngOnChanges(): void {
    this.updatePolicies();
  }

  public deletePolicy(policy: Policy<TimePolicy>): void {
    this.onPolicyDelete.next(policy);
  }

  public updatePolicies(): void {
    const daysOfWeek = [
      { value: DayOfWeek.Sunday, name: 'SUNDAY'},
      { value: DayOfWeek.Monday, name: 'MONDAY'},
      { value: DayOfWeek.Tuesday, name: 'TUESDAY'},
      { value: DayOfWeek.Wednesday, name: 'WEDNESDAY'},
      { value: DayOfWeek.Thursday, name: 'THURSDAY'},
      { value: DayOfWeek.Friday, name: 'FRIDAY'},
      { value: DayOfWeek.Saturday, name: 'SATURDAY'},
    ];

    this.policies = [
      ...(this.hourlyPolicy ? [{
        id: this.hourlyPolicy.id,
        type: PolicyType.Hourly,
        timeToken: 'POLICY_HOURLY_TIME',
        timeValue: this.hourlyPolicy.timePolicy.minute.toString(),
        periodToken: '',
        periodValue: '',
        timeZone: this.hourlyPolicy.timeZone.zone,
        keep: this.hourlyPolicy.storedSnapshots.toString()
      }] : []),
      ...(this.dailyPolicy ? [{
        id: this.dailyPolicy.id,
        type: PolicyType.Daily,
        timeToken: 'POLICY_DAILY_TIME',
        timeValue: this.getTimeString(this.dailyPolicy.timePolicy),
        periodToken: '',
        periodValue: '',
        timeZone: this.dailyPolicy.timeZone.zone,
        keep: this.dailyPolicy.storedSnapshots.toString()
      }] : []),
      ...(this.weeklyPolicy ? [{
        id: this.weeklyPolicy.id,
        type: PolicyType.Weekly,
        timeToken: 'POLICY_WEEKLY_TIME',
        timeValue: this.getTimeString(this.weeklyPolicy.timePolicy),
        periodToken: 'POLICY_WEEKLY_PERIOD',
        periodValue: daysOfWeek.find(_ => _.value === this.weeklyPolicy.timePolicy.dayOfWeek).name,
        timeZone: this.weeklyPolicy.timeZone.zone,
        keep: this.weeklyPolicy.storedSnapshots.toString()
      }] : []),
      ...(this.monthlyPolicy ? [{
        id: this.monthlyPolicy.id,
        type: PolicyType.Monthly,
        timeToken: 'POLICY_MONTHLY_TIME',
        timeValue: this.getTimeString(this.monthlyPolicy.timePolicy),
        periodToken: 'POLICY_MONTHLY_PERIOD',
        periodValue: this.monthlyPolicy.timePolicy.dayOfMonth.toString(),
        timeZone: this.monthlyPolicy.timeZone.zone,
        keep: this.monthlyPolicy.storedSnapshots.toString()
      }] : [])
    ];
  }

  private getTimeString(time: Time): string {
    // todo am/pm
    return `${time.hour}:${time.minute} ${time.period}`;
  }
}
