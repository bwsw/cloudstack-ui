import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PolicyType } from '../recurring-snapshots.component';
import { TimeZone } from '../time-zone/time-zone.service';
import { DailyPolicy } from './daily/daily-policy.component';
import { HourlyPolicy } from './hourly/hourly-policy.component';
import { MonthlyPolicy } from './monthly/monthly-policy.component';
import { WeeklyPolicy } from './weekly/weekly-policy.component';
import { TimeFormat } from '../../../shared/services';


export type TimePolicy = HourlyPolicy & DailyPolicy & WeeklyPolicy & MonthlyPolicy;

export interface Policy<T> {
  id?: string;
  storedSnapshots: number;
  timePolicy: T;
  timeZone: TimeZone;
  type?: PolicyType
}

@Component({
  selector: 'cs-policy-editor',
  templateUrl: 'policy-editor.component.html',
  styleUrls: ['policy-editor.component.scss']
})
export class PolicyEditorComponent {
  @Input() public timeFormat: TimeFormat;
  @Input() policyMode: PolicyType;
  @Output() onPolicySave: EventEmitter<Policy<TimePolicy>>;

  public Policies = PolicyType;

  public policy = { minute: 0 };

  public timeZone: TimeZone;

  public minStoredSnapshots = 1;
  public maxStoredSnapshots = 8;
  public storedSnapshots = 1;

  constructor() {
    this.onPolicySave = new EventEmitter<Policy<TimePolicy>>();
  }

  public save(): void {
    this.onPolicySave.emit({
      timePolicy: this.policy as TimePolicy,
      timeZone: this.timeZone,
      storedSnapshots: this.storedSnapshots
    });
  }
}
