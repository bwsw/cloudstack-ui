import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import {
  AbstractPolicy,
  HourlyPolicy,
  DailyPolicy,
  WeeklyPolicy,
  MonthlyPolicy,
  RecurringSnapshotPolicy
} from '../recurring-snapshots.component';

const timeZones = require('timezones.json');

@Component({
  selector: 'period-selector',
  templateUrl: 'period-selector.component.html',
  styleUrls: ['period-selector.component.scss']
})
export class PeriodSelectorComponent implements OnInit {
  @Input() public policy: RecurringSnapshotPolicy;
  @Output() public onPolicyChange = new EventEmitter<AbstractPolicy>();

  public currentPolicy: AbstractPolicy;

  // todo: make it load on demand a'la config service
  public timeZones: any;
  public Policy = RecurringSnapshotPolicy;


  public ngOnInit(): void {
    this.timeZones = Object.keys(timeZones);
    this.currentPolicy = this.convertEnumPolicyToClass(this.policy);
  }

  private convertEnumPolicyToClass(enumPolicy: RecurringSnapshotPolicy): AbstractPolicy {
    switch (enumPolicy) {
      case (RecurringSnapshotPolicy.Hourly):
        return new HourlyPolicy();
      case (RecurringSnapshotPolicy.Daily):
        return new DailyPolicy();
      case (RecurringSnapshotPolicy.Weekly):
        return new WeeklyPolicy();
      case (RecurringSnapshotPolicy.Monthly):
        return new MonthlyPolicy();
      default:
        throw new Error('invalid policy');
    }
  }
}
