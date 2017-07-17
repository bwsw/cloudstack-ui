import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PolicyType } from '../recurring-snapshots.component';
import { TimeZone } from '../time-zone/time-zone.service';
import { DailyPolicy } from './daily/daily-policy.component';
import { HourlyPolicy } from './hourly/hourly-policy.component';
import { MonthlyPolicy } from './monthly/monthly-policy.component';
import { WeeklyPolicy } from './weekly/weekly-policy.component';


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
  @Input() policyMode: PolicyType;
  @Output() onPolicySave: EventEmitter<Policy<TimePolicy>>;

  public Policies = PolicyType;

  public policy: TimePolicy;

  public timeZone: TimeZone;
  public storedSnapshots = 1;

  constructor() {
    this.onPolicySave = new EventEmitter<Policy<TimePolicy>>();
  }

  public save(): void {
    this.onPolicySave.emit({
      timePolicy: this.policy,
      timeZone: this.timeZone,
      storedSnapshots: this.storedSnapshots
    });
  }
}
