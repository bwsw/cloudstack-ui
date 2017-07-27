import { Injectable } from '@angular/core';
import { PolicyType } from '../recurring-snapshots.component';
import { Policy, TimePolicy } from '../policy-editor/policy-editor.component';
import { DayOfWeek } from '../../../shared/types/day-of-week';
import DateTimeFormat = Intl.DateTimeFormat;


interface PolicyView {
  id: string;
  type: PolicyType;
  timeToken: string;
  timeValue: string;
  periodToken: string;
  periodValue: string;
  timeZone: string;
  keep: number;
}

interface DayOfWeekToken {
  value: DayOfWeek,
  name: string
}

@Injectable()
export class PolicyViewBuilderService {
  public buildPolicyViewFromPolicy(
    policy: Policy<TimePolicy>,
    dateStringifyDateTimeFormat: DateTimeFormat
  ): PolicyView {
    return {
      id: policy.id,
      type: policy.type,
      timeToken: this.getTimeToken(policy),
      timeValue: this.getTimeString(policy, dateStringifyDateTimeFormat),
      periodToken: this.getPeriodToken(policy),
      periodValue: this.getPeriodValue(policy),
      timeZone: this.getTimeZone(policy),
      keep: this.getKeepNumber(policy)
    }
  }

  private get daysOfWeek(): Array<DayOfWeekToken> {
    return [
      { value: DayOfWeek.Sunday, name: 'SUNDAY_LOWER' },
      { value: DayOfWeek.Monday, name: 'MONDAY_LOWER' },
      { value: DayOfWeek.Tuesday, name: 'TUESDAY_LOWER' },
      { value: DayOfWeek.Wednesday, name: 'WEDNESDAY_LOWER' },
      { value: DayOfWeek.Thursday, name: 'THURSDAY_LOWER' },
      { value: DayOfWeek.Friday, name: 'FRIDAY_LOWER' },
      { value: DayOfWeek.Saturday, name: 'SATURDAY_LOWER' }
    ];
  }

  private getPeriodToken(policy: Policy<any>): string {
    if (policy.type === PolicyType.Weekly) {
      return 'POLICY_WEEKLY_PERIOD';
    }

    if (policy.type === PolicyType.Monthly) {
      return 'POLICY_MONTHLY_PERIOD';
    }

    return '';
  }

  private getPeriodValue(policy: Policy<any>): string {
    if (policy.type === PolicyType.Weekly) {
      return this.daysOfWeek.find(_ => _.value === policy.timePolicy.dayOfWeek).name;
    }

    if (policy.type === PolicyType.Monthly) {
      return (policy.timePolicy.dayOfMonth || 0).toString()
    }

    return '';
  }

  private getKeepNumber(policy: Policy<any>): number {
    return policy.storedSnapshots || 0;
  }

  private getTimeString(policy: Policy<TimePolicy>, dateStringifyDateTimeFormat: DateTimeFormat): string {
    if (policy.type === PolicyType.Hourly) {
      return (policy.timePolicy.minute || 0).toString()
    }

    const date = new Date();
    date.setHours(policy.timePolicy.hour);
    date.setMinutes(policy.timePolicy.minute);

    return dateStringifyDateTimeFormat.format(date);
  }

  private getTimeToken(policy: Policy<TimePolicy>): string {
    if (policy.type === PolicyType.Hourly) {
      return 'POLICY_HOURLY_TIME';
    }

    if (policy.type === PolicyType.Daily) {
      return 'POLICY_DAILY_TIME';
    }

    if (policy.type === PolicyType.Weekly) {
      return 'POLICY_WEEKLY_TIME';
    }

    if (policy.type === PolicyType.Monthly) {
      return 'POLICY_MONTHLY_TIME';
    }

    return '';
  }

  private getTimeZone(policy: Policy<TimePolicy>): string {
    return policy.timeZone.geo;
  }
}
