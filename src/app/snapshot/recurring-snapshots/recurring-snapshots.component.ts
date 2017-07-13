import { Component, forwardRef, OnInit } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { SgRulesManagerComponent } from '../../shared';
import { Policy } from './policy/policy.component';


export enum PolicyMode {
  Hourly,
  Daily,
  Weekly,
  Monthly
}

@Component({
  selector: 'cs-recurring-snapshots',
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
export class RecurringSnapshotsComponent implements OnInit {
  public policyMode: PolicyMode;

  public hourlyPolicy: Policy;
  public dailyPolicy: Policy;
  public weeklyPolicy: Policy;
  public monthlyPolicy: Policy;

  public ngOnInit(): void {
    this.policyMode = PolicyMode.Hourly;
  }

  public tabChanged(tab: any): void {
    this.policyMode = tab.index;
  }

  public addPolicy(policy: Policy): void {
    switch (this.policyMode) {
      case PolicyMode.Hourly:
        this.hourlyPolicy = policy;
        break;
      case PolicyMode.Daily:
        this.dailyPolicy = policy;
        break;
      case PolicyMode.Weekly:
        this.weeklyPolicy = policy;
        break;
      case PolicyMode.Monthly:
        this.monthlyPolicy = policy;
        break;
      default:
        break;
    }
  }
}
