import { Component, forwardRef, Inject, OnInit } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { MdlDialogReference } from '../../dialog/dialog-module';
import { DialogService } from '../../dialog/dialog-module/dialog.service';
import { SgRulesManagerComponent } from '../../shared';
import { Volume } from '../../shared/models';
import { DailyPolicy } from './policy-editor/daily/daily-policy.component';
import { HourlyPolicy } from './policy-editor/hourly/hourly-policy.component';
import { MonthlyPolicy } from './policy-editor/monthly/monthly-policy.component';
import { Policy, TimePolicy } from './policy-editor/policy-editor.component';
import { WeeklyPolicy } from './policy-editor/weekly/weekly-policy.component';
import { SnapshotPolicyService } from './snapshot-policy.service';


export enum PolicyType {
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
  public policyMode = PolicyType.Hourly;

  public hourlyPolicy: Policy<HourlyPolicy>;
  public dailyPolicy: Policy<DailyPolicy>;
  public weeklyPolicy: Policy<WeeklyPolicy>;
  public monthlyPolicy: Policy<MonthlyPolicy>;

  public loading: boolean;

  constructor(
    @Inject('volume') public volume: Volume,
    private dialog: MdlDialogReference,
    private dialogService: DialogService,
    private snapshotPolicyService: SnapshotPolicyService
  ) {}

  public ngOnInit(): void {
    this.loadPolicies();
  }

  public tabChanged(tab: any): void {
    this.policyMode = tab.index;
  }

  public addPolicy(policy: Policy<any>): void {
    this.snapshotPolicyService.create({
      policy,
      policyType: this.policyMode,
      volumeId: this.volume.id
    })
      .subscribe(
        () => this.setPolicyValue(policy, this.policyMode),
        error => this.onError(error)
      );
  }

  public deletePolicy(policy: Policy<TimePolicy>): void {
    this.snapshotPolicyService.remove(policy.id)
      .subscribe(
        () => this.setPolicyValue(undefined, policy.type),
        error => this.onError(error)
      );
  }

  public onClose(): void {
    this.dialog.hide();
  }

  private loadPolicies(): void {
    this.loading = true;

    this.snapshotPolicyService.getPolicyList(this.volume.id)
      .finally(() => this.loading = false)
      .subscribe(
        policies => {
          policies.forEach(policy => {
            this.setPolicyValue(policy, policy.type);
          });
        },
        error => this.onError(error)
      );
  }

  private setPolicyValue(value: Policy<TimePolicy>, type: PolicyType): void {
    switch (type) {
      case PolicyType.Hourly:
        this.hourlyPolicy = value;
        break;
      case PolicyType.Daily:
        this.dailyPolicy = value;
        break;
      case PolicyType.Weekly:
        this.weeklyPolicy = value;
        break;
      case PolicyType.Monthly:
        this.monthlyPolicy = value;
        break;
      default:
        break;
    }
  }

  private onError(error: any): void {
    this.dialogService.alert({
      translationToken: error.message,
      interpolateParams: error.params
    });
  }
}
