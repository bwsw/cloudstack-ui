import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import * as fromAccounts from '../../reducers/accounts/redux/accounts.reducers';
import { takeUntil } from 'rxjs/operators';

import * as configurationAction from '../../reducers/configuration/redux/configurations.actions';
import * as fromConfigurations from '../../reducers/configuration/redux/configurations.reducers';
import { State } from '../../reducers';
import * as resourceCountAction from '../../reducers/resource-count/redux/resource-counts.actions';
import * as fromResourceCounts from '../../reducers/resource-count/redux/resource-counts.reducers';
import * as resourceLimitAction from '../../reducers/resource-limit/redux/resource-limits.actions';
import * as fromResourceLimits from '../../reducers/resource-limit/redux/resource-limits.reducers';
import { AuthService } from '../../shared/services/auth.service';
import { WithUnsubscribe } from '../../utils/mixins/with-unsubscribe';
import { Account, ResourceLimit } from '../../shared/models';

@Component({
  selector: 'cs-account-page-container',
  template: `
    <cs-account-detail
      [account]="account$ | async"
    ></cs-account-detail>
    <cs-account-settings
      [account]="account$ | async"
      [configurations]="configurations$ | async"
      (configurationEdited)="onConfigurationEdit($event)"
    >
    </cs-account-settings>
    <cs-account-limits
      [limits]="limits$ | async"
      [isAdmin]="isAdmin()"
      (limitsUpdate)="onLimitsUpdate($event)"
    ></cs-account-limits>
    <cs-account-statistics
      *ngIf="isAdmin()"
      [stats]="stats$ | async"
      (statisticsUpdate)="onStatisticsUpdate()"
    ></cs-account-statistics>`,
})
export class AccountDetailsContainerComponent extends WithUnsubscribe() implements OnInit {
  readonly account$ = this.store.pipe(select(fromAccounts.getSelectedAccount));
  readonly configurations$ = this.store.pipe(select(fromConfigurations.selectAll));
  readonly limits$ = this.store.pipe(select(fromResourceLimits.getAllLimits));
  readonly stats$ = this.store.pipe(select(fromResourceCounts.selectAll));

  public account: Account;

  constructor(private store: Store<State>, private authService: AuthService) {
    super();
  }

  public onConfigurationEdit(configuration) {
    this.store.dispatch(
      new configurationAction.UpdateConfigurationRequest({
        configuration,
        account: this.account,
      }),
    );
  }

  public onLimitsUpdate(limits: ResourceLimit[]) {
    this.store.dispatch(new resourceLimitAction.UpdateResourceLimitsRequest(limits));
  }

  public onStatisticsUpdate() {
    this.store.dispatch(
      new resourceCountAction.LoadResourceCountsRequest({
        account: this.account.name,
        domainid: this.account.domainid,
      }),
    );
  }

  public ngOnInit() {
    this.account$.pipe(takeUntil(this.unsubscribe$)).subscribe(account => {
      if (account) {
        this.account = account;
        this.store.dispatch(
          new resourceLimitAction.LoadResourceLimitsRequest({
            account: account.name,
            domainid: account.domainid,
          }),
        );

        if (this.isAdmin()) {
          this.store.dispatch(
            new configurationAction.LoadConfigurationsRequest({ accountid: account.id }),
          );
          this.store.dispatch(
            new resourceCountAction.LoadResourceCountsRequest({
              account: account.name,
              domainid: account.domainid,
            }),
          );
        }
      }
    });
  }

  public isAdmin() {
    return this.authService.isAdmin();
  }
}
