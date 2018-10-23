import { Component, forwardRef, Inject, OnInit } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { finalize, map, switchMap } from 'rxjs/operators';

import { DialogService } from '../../dialog/dialog-service/dialog.service';
import { Volume } from '../../shared/models';
import { Policy, TimePolicy } from './policy-editor/policy-editor.component';
import { SnapshotPolicyService } from './snapshot-policy.service';
import { PolicyType } from './snapshot-policy-type';
import { TimeFormat } from '../../shared/types';
import { State, UserTagsSelectors } from '../../root-store';

@Component({
  selector: 'cs-recurring-snapshots',
  templateUrl: 'recurring-snapshots.component.html',
  styleUrls: ['recurring-snapshots.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RecurringSnapshotsComponent),
      multi: true,
    },
  ],
})
export class RecurringSnapshotsComponent implements OnInit {
  public policyMode = PolicyType.Hourly;
  public policies: Policy<TimePolicy>[];
  public loading: boolean;

  readonly timeFormat$: Observable<TimeFormat> = this.store.pipe(
    select(UserTagsSelectors.getTimeFormat),
    map(format => {
      if (format === TimeFormat.hour24) {
        return format;
      }
      return TimeFormat.hour12;
    }),
  );

  constructor(
    @Inject(MAT_DIALOG_DATA) public volume: Volume,
    private dialogService: DialogService,
    private snapshotPolicyService: SnapshotPolicyService,
    private store: Store<State>,
  ) {
    this.updatePolicies().subscribe();
  }

  public ngOnInit(): void {
    this.loading = true;
    this.updatePolicies()
      .pipe(finalize(() => (this.loading = false)))
      .subscribe(() => {}, error => this.onError(error));
  }

  public tabChanged(tab: any): void {
    this.policyMode = tab.index;
  }

  public changeTab(type: PolicyType): void {
    this.policyMode = type;
  }

  public addPolicy(policy: Policy<any>): void {
    this.snapshotPolicyService
      .create({
        policy,
        policyType: this.policyMode,
        volumeId: this.volume.id,
      })
      .pipe(switchMap(() => this.updatePolicies()))
      .subscribe(() => {}, error => this.onError(error));
  }

  public deletePolicy(policy: Policy<TimePolicy>): void {
    this.snapshotPolicyService
      .remove(policy.id)
      .pipe(switchMap(() => this.updatePolicies()))
      .subscribe(() => {}, error => this.onError(error));
  }

  private updatePolicies(): Observable<Policy<TimePolicy>[]> {
    return this.snapshotPolicyService.getPolicyList(this.volume.id).pipe(
      map(policies => {
        this.policies = policies;
        return policies;
      }),
    );
  }

  private onError(error): void {
    this.dialogService.alert({
      message: {
        translationToken: error.message,
        interpolateParams: error.params,
      },
    });
  }
}
