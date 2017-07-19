import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
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
  timeValue: Observable<string>;
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

  constructor(private translateService: TranslateService) {
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
      { value: DayOfWeek.Sunday, name: 'SUNDAY_LOWER' },
      { value: DayOfWeek.Monday, name: 'MONDAY_LOWER' },
      { value: DayOfWeek.Tuesday, name: 'TUESDAY_LOWER' },
      { value: DayOfWeek.Wednesday, name: 'WEDNESDAY_LOWER' },
      { value: DayOfWeek.Thursday, name: 'THURSDAY_LOWER' },
      { value: DayOfWeek.Friday, name: 'FRIDAY_LOWER' },
      { value: DayOfWeek.Saturday, name: 'SATURDAY_LOWER' }
    ];

    const policies: Array<PolicyView> = [];

    if (this.hourlyPolicy && this.hourlyPolicy.timePolicy) {
      policies.push({
        id: this.hourlyPolicy.id,
        type: PolicyType.Hourly,
        timeToken: 'POLICY_HOURLY_TIME',
        timeValue: Observable.of((this.hourlyPolicy.timePolicy.minute || 0).toString()),
        periodToken: '',
        periodValue: '',
        timeZone: this.hourlyPolicy.timeZone.geo,
        keep: (this.hourlyPolicy.storedSnapshots || 0).toString()
      });
    }

    if (this.dailyPolicy && this.dailyPolicy.timePolicy) {
      policies.push({
        id: this.dailyPolicy.id,
        type: PolicyType.Daily,
        timeToken: 'POLICY_DAILY_TIME',
        timeValue: this.getTimeString(this.dailyPolicy.timePolicy),
        periodToken: '',
        periodValue: '',
        timeZone: this.dailyPolicy.timeZone.geo,
        keep: (this.dailyPolicy.storedSnapshots || 0).toString()
      });
    }

    if (this.weeklyPolicy && this.weeklyPolicy.timePolicy) {
      policies.push({
        id: this.weeklyPolicy.id,
        type: PolicyType.Weekly,
        timeToken: 'POLICY_WEEKLY_TIME',
        timeValue: this.getTimeString(this.weeklyPolicy.timePolicy),
        periodToken: 'POLICY_WEEKLY_PERIOD',
        periodValue: daysOfWeek.find(_ => _.value === this.weeklyPolicy.timePolicy.dayOfWeek).name,
        timeZone: this.weeklyPolicy.timeZone.geo,
        keep: (this.weeklyPolicy.storedSnapshots || 0).toString()
      });
    }

    if (this.monthlyPolicy && this.monthlyPolicy.timePolicy) {
      policies.push({
        id: this.monthlyPolicy.id,
        type: PolicyType.Monthly,
        timeToken: 'POLICY_MONTHLY_TIME',
        timeValue: this.getTimeString(this.monthlyPolicy.timePolicy),
        periodToken: 'POLICY_MONTHLY_PERIOD',
        periodValue: (this.monthlyPolicy.timePolicy.dayOfMonth || 0).toString(),
        timeZone: this.monthlyPolicy.timeZone.geo,
        keep: (this.monthlyPolicy.storedSnapshots || 0).toString()
      });
    }

    this.policies = policies;
  }

  private getTimeString(time: Time): Observable<string> {
    const amPm = [
      'AM',
      'PM'
    ];

    return this.translateService.get(['AM', 'PM'])
      .map(translations => {
        return `${time.hour}:${this.pad(time.minute)} ${translations[amPm[time.period]]}`;
      });
  }

  private pad(value: any): string {
    return +value < 10 ? `0${+value}` : `${+value}`;
  }
}
