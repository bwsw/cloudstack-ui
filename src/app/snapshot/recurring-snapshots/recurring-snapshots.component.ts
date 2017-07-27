import { ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, Inject, OnInit } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { MdlDialogReference } from '../../dialog/dialog-module';
import { DialogService } from '../../dialog/dialog-module/dialog.service';
import { SgRulesManagerComponent } from '../../shared';
import { Volume } from '../../shared/models';
import { Policy, TimePolicy } from './policy-editor/policy-editor.component';
import { SnapshotPolicyService } from './snapshot-policy.service';
import { LanguageService, TimeFormat, TimeFormats } from '../../shared/services';


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
  changeDetection: ChangeDetectionStrategy.OnPush,
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
      if (format === TimeFormats.hour24) {
        return format;
      }
      return TimeFormats.hour12;
    });

  constructor(
    @Inject('volume') public volume: Volume,
    private cd: ChangeDetectorRef,
    private dialog: MdlDialogReference,
    private dialogService: DialogService,
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
    this.tabChanged(this.policyMode);
  }

  public tabChanged(tab: any): void {
    this.policyMode = tab.index;
    setTimeout(() => this.cd.markForCheck());
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
    this.dialog.hide();
  }

  private updatePolicies(): Observable<Array<Policy<TimePolicy>>> {
    return this.snapshotPolicyService.getPolicyList(this.volume.id)
      .map(policies => {
        this.policies = policies;
        return policies;
      })
  }

  private onError(error: any): void {
    this.dialogService.alert({
      translationToken: error.message,
      interpolateParams: error.params
    });
  }
}
