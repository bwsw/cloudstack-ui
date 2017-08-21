import { ChangeDetectorRef, Component, forwardRef, Inject, OnInit } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { MdlDialogReference } from '../../dialog/dialog-module';
import { DialogsService } from '../../dialog/dialog-service/dialog.service';
import { SgRulesManagerComponent } from '../../shared';
import { Volume } from '../../shared/models';
import { LanguageService, TimeFormat } from '../../shared/services/language.service';
import { Policy, TimePolicy } from './policy-editor/policy-editor.component';
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
  public policies: Array<Policy<TimePolicy>>;
  public loading: boolean;

  readonly timeFormat$: Observable<TimeFormat> = this.languageService.getTimeFormat()
    .map(format => {
      if (format === TimeFormat.hour24) {
        return format;
      }
      return TimeFormat.hour12;
    });

  constructor(
    @Inject(MD_DIALOG_DATA) public volume: Volume,
    private cd: ChangeDetectorRef,
    private dialogRef: MdDialogRef<RecurringSnapshotsComponent>,
    private dialogsService: DialogsService,
    private languageService: LanguageService,
    private snapshotPolicyService: SnapshotPolicyService
  ) {
    this.updatePolicies().subscribe();
  }

  public ngOnInit(): void {
    this.loading = true;
    this.updatePolicies()
      .finally(() => this.loading = false)
      .subscribe(
        () => {},
        error => this.onError(error)
      );
  }

  public tabChanged(tab: any): void {
    this.policyMode = tab.index;
  }

  public changeTab(type: PolicyType): void {
    this.policyMode = type;
  }

  public addPolicy(policy: Policy<any>): void {
    this.snapshotPolicyService.create({
      policy,
      policyType: this.policyMode,
      volumeId: this.volume.id
    })
      .switchMap(() => this.updatePolicies())
      .subscribe(
        () => {},
        error => this.onError(error)
      );
  }

  public deletePolicy(policy: Policy<TimePolicy>): void {
    this.snapshotPolicyService.remove(policy.id)
      .switchMap(() => this.updatePolicies())
      .subscribe(
        () => {},
        error => this.onError(error)
      );
  }

  public onClose(): void {
    this.dialogRef.close();
  }

  private updatePolicies(): Observable<Array<Policy<TimePolicy>>> {
    return this.snapshotPolicyService.getPolicyList(this.volume.id)
      .map(policies => {
        this.policies = policies;
        return policies;
      })
  }

  private onError(error: any): void {
    this.dialogsService.alert({
      message: {
        translationToken: error.message,
        interpolateParams: error.params
      }
    });
  }
}
