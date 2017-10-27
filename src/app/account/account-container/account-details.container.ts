import {
  Component,
  OnInit
} from '@angular/core';
import { State } from '../../reducers/index';
import { Store } from '@ngrx/store';
import * as configurationAction from '../../reducers/configuration/redux/configurations.actions';
import * as resourceLimitAction from '../../reducers/resource-limit/redux/resource-limits.actions';
import * as resourceCountAction from '../../reducers/resource-count/redux/resource-counts.actions';
import * as fromAccounts from '../../reducers/accounts/redux/accounts.reducers';
import * as fromConfigurations from '../../reducers/configuration/redux/configurations.reducers';
import * as fromResourceLimits from '../../reducers/resource-limit/redux/resource-limits.reducers';
import * as fromResourceCounts from '../../reducers/resource-count/redux/resource-counts.reducers';
import { WithUnsubscribe } from '../../utils/mixins/with-unsubscribe';
import { AuthService } from '../../shared/services/auth.service';
import { Account } from '../../shared/models/account.model';

@Component({
  selector: 'cs-account-page-container',
  template: `
    <cs-account-detail
      [account]="account$ | async"
    ></cs-account-detail>
    <cs-account-settings
      *ngIf="isAdmin()"
      [account]="account$ | async"
      [configurations]="configurations$ | async"
      (onConfigurationEdit)="onConfigurationEdit($event)"
    >
    </cs-account-settings>
    <cs-account-limits
      [limits]="limits$ | async"
      [isAdmin]="isAdmin()"
      (onLimitsEdit)="onLimitsEdit($event)"
    ></cs-account-limits>
    <cs-account-statistics
      *ngIf="isAdmin()"
      [stats]="stats$ | async"
      (onStatsUpdate)="onStatsUpdate($event)"
    ></cs-account-statistics>`
})
export class AccountDetailsContainerComponent extends WithUnsubscribe() implements OnInit {

  readonly account$ = this.store.select(fromAccounts.getSelectedAccount);
  readonly configurations$ = this.store.select(fromConfigurations.selectAll);
  readonly limits$ = this.store.select(fromResourceLimits.selectAll);
  readonly stats$ = this.store.select(fromResourceCounts.selectAll);

  public account: Account;


  constructor(
    private store: Store<State>,
    private authService: AuthService
  ) {
    super();
  }

  public onConfigurationEdit(configuration) {
    this.store.dispatch(new configurationAction.UpdateConfigurationRequest({
      configuration,
      account: this.account
    }));
  }

  public onLimitsEdit(limits) {
    this.store.dispatch(new resourceLimitAction.UpdateResourceLimitsRequest({
      limits,
      account: this.account
    }));
  }

  public onStatsUpdate(stats) {
    this.store.dispatch(new resourceCountAction.LoadResourceCountsRequest({
      account: this.account.name,
      domainid: this.account.domainid
    }));
  }

  public ngOnInit() {
    this.account$
      .takeUntil(this.unsubscribe$)
      .subscribe(account => {
        if (account) {
          this.account = account;
          this.store.dispatch(new resourceLimitAction.LoadResourceLimitsRequest({
            account: account.name,
            domainid: account.domainid
          }));

          if (this.isAdmin()) {
            this.store.dispatch(new configurationAction.LoadConfigurationsRequest({ accountid: account.id }));
            this.store.dispatch(new resourceCountAction.LoadResourceCountsRequest({
              account: account.name,
              domainid: account.domainid
            }));
          }
        }
      });
  }


  public isAdmin() {
    return this.authService.isAdmin();
  }

}
