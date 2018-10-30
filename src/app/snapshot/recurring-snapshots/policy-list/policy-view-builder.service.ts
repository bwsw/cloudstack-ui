import { Injectable } from '@angular/core';
import { Policy, TimePolicy } from '../policy-editor/policy-editor.component';
import { DayOfWeek } from '../../../shared/types/day-of-week';
import { PolicyType } from '../snapshot-policy-type';
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
  value: DayOfWeek;
  name: string;
}

@Injectable()
export class PolicyViewBuilderService {
  public buildPolicyViewFromPolicy(
    policy: Policy<TimePolicy>,
    dateStringifyDateTimeFormat: DateTimeFormat,
  ): PolicyView {
    return {
      id: policy.id,
      type: policy.type,
      timeToken: this.getTimeToken(policy),
      timeValue: this.getTimeString(policy, dateStringifyDateTimeFormat),
      periodToken: this.getPeriodToken(policy),
      periodValue: this.getPeriodValue(policy),
      timeZone: this.getTimeZone(policy),
      keep: this.getKeepNumber(policy),
    };
  }

  private get daysOfWeek(): DayOfWeekToken[] {
    return [
      { value: DayOfWeek.Sunday, name: 'DATE_TIME.DAYS_OF_WEEK.SUNDAY_LOWER' },
      { value: DayOfWeek.Monday, name: 'DATE_TIME.DAYS_OF_WEEK.MONDAY_LOWER' },
      { value: DayOfWeek.Tuesday, name: 'DATE_TIME.DAYS_OF_WEEK.TUESDAY_LOWER' },
      { value: DayOfWeek.Wednesday, name: 'DATE_TIME.DAYS_OF_WEEK.WEDNESDAY_LOWER' },
      { value: DayOfWeek.Thursday, name: 'DATE_TIME.DAYS_OF_WEEK.THURSDAY_LOWER' },
      { value: DayOfWeek.Friday, name: 'DATE_TIME.DAYS_OF_WEEK.FRIDAY_LOWER' },
      { value: DayOfWeek.Saturday, name: 'DATE_TIME.DAYS_OF_WEEK.SATURDAY_LOWER' },
    ];
  }

  private getPeriodToken(policy: Policy<any>): string {
    if (policy.type === PolicyType.Weekly) {
      return 'SNAPSHOT_POLICIES.WEEKLY_PERIOD';
    }

    if (policy.type === PolicyType.Monthly) {
      return 'SNAPSHOT_POLICIES.MONTHLY_PERIOD';
    }

    return '';
  }

  private getPeriodValue(policy: Policy<any>): string {
    if (policy.type === PolicyType.Weekly) {
      return this.daysOfWeek.find(_ => _.value === policy.timePolicy.dayOfWeek).name;
    }

    if (policy.type === PolicyType.Monthly) {
      return (policy.timePolicy.dayOfMonth || 0).toString();
    }

    return '';
  }

  private getKeepNumber(policy: Policy<any>): number {
    return policy.storedSnapshots || 0;
  }

  private getTimeString(
    policy: Policy<TimePolicy>,
    dateStringifyDateTimeFormat: DateTimeFormat,
  ): string {
    if (policy.type === PolicyType.Hourly) {
      return (policy.timePolicy.minute || 0).toString();
    }

    const date = new Date();
    date.setHours(policy.timePolicy.hour);
    date.setMinutes(policy.timePolicy.minute);

    return dateStringifyDateTimeFormat.format(date);
  }

  private getTimeToken(policy: Policy<TimePolicy>): string {
    const timeTokens = {
      [PolicyType.Hourly]: 'SNAPSHOT_POLICIES.HOURLY_TIME',
      [PolicyType.Daily]: 'SNAPSHOT_POLICIES.DAILY_TIME',
      [PolicyType.Weekly]: 'SNAPSHOT_POLICIES.WEEKLY_TIME',
      [PolicyType.Monthly]: 'SNAPSHOT_POLICIES.MONTHLY_TIME',
    };

    return timeTokens[policy.type];
  }

  private getTimeZone(policy: Policy<TimePolicy>): string {
    return policy.timeZone.geo;
  }
}
