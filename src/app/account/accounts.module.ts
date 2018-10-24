import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { DynamicModule } from 'ng-dynamic-component';

import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../material/material.module';
import { DraggableSelectModule } from '../shared/components/draggable-select/draggable-select.module';

import { AccountsEffects } from '../reducers/accounts/redux/accounts.effects';
import { accountReducers } from '../reducers/accounts/redux/accounts.reducers';
import { ConfigurationEffects } from '../reducers/configuration/redux/configurations.effects';
import { configurationReducers } from '../reducers/configuration/redux/configurations.reducers';
import { DomainsEffects } from '../reducers/domains/redux/domains.effects';
import { domainReducers } from '../reducers/domains/redux/domains.reducers';
import { ResourceCountsEffects } from '../reducers/resource-count/redux/resource-counts.effects';
import { resourceCountsReducers } from '../reducers/resource-count/redux/resource-counts.reducers';
import { ResourceLimitsEffects } from '../reducers/resource-limit/redux/resource-limits.effects';
import { resourceLimitsReducers } from '../reducers/resource-limit/redux/resource-limits.reducers';
import { RolesEffects } from '../reducers/roles/redux/roles.effects';
import { roleReducers } from '../reducers/roles/redux/roles.reducers';
import { AccountActionsContainerComponent } from './account-container/account-actions.container';
import { AccountCreationContainerComponent } from './account-container/account-creation.container';
import { AccountDetailsContainerComponent } from './account-container/account-details.container';
import { AccountFilterContainerComponent } from './account-container/account-filter.container';
import { AccountSidebarContainerComponent } from './account-container/account-sidebar.container';
import { AccountUserEditContainerComponent } from './account-container/account-user-edit.container';
import { AccountUserPasswordFormContainerComponent } from './account-container/account-user-password.container';
import { AccountUsersContainerComponent } from './account-container/account-users.container';
import { AccountPageContainerComponent } from './account-container/account.container';
import { AccountListFilterComponent } from './account-list-filter/account-list-filter.component';
import { AccountListComponent } from './account-list/account-list.component';
import { AccountPageComponent } from './account-page/account-page.component';
import { AccountDetailsComponent } from './account-sidebar/account-details/account-details.component';
import { AccountLimitsComponent } from './account-sidebar/account-limits/account-limits.component';
// tslint:disable-next-line
import { AccountConfigurationComponent } from './account-sidebar/account-settings/account-configuration/account-configuration.component';
// tslint:disable-next-line
import { EditAccountConfigurationComponent } from './account-sidebar/account-settings/account-configuration/edit-account-configuration.component';
import { AccountSettingsComponent } from './account-sidebar/account-settings/account-settings.component';
import { AccountSidebarComponent } from './account-sidebar/account-sidebar.component';
import { AccountStatisticsComponent } from './account-sidebar/account-statistic/account-statistics.component';
import { AccountUserCardComponent } from './account-sidebar/account-users/account-user-card.component';
import { AccountUserEditComponent } from './account-sidebar/account-users/account-user-edit.component';
import { AccountUserPasswordFormComponent } from './account-sidebar/account-users/account-user-password.component';
import { AccountUsersComponent } from './account-sidebar/account-users/account-users.component';
import { AccountCardItemComponent } from './account/card-item/account-card-item.component';
import { AccountRowItemComponent } from './account/row-item/account-row-item.component';
import { AccountCreationDialogComponent } from './creation-form/account-creation-dialog.component';
import { AccountCreationComponent } from './creation-form/account-creation.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MaterialModule,
    DynamicModule.withComponents([AccountCardItemComponent, AccountRowItemComponent]),
    RouterModule,
    DraggableSelectModule,
    StoreModule.forFeature('configurations', configurationReducers),
    StoreModule.forFeature('resourceLimits', resourceLimitsReducers),
    StoreModule.forFeature('resourceCounts', resourceCountsReducers),
    StoreModule.forFeature('accounts', accountReducers),
    StoreModule.forFeature('domains', domainReducers),
    StoreModule.forFeature('roles', roleReducers),
    EffectsModule.forFeature([
      AccountsEffects,
      DomainsEffects,
      RolesEffects,
      ConfigurationEffects,
      ResourceLimitsEffects,
      ResourceCountsEffects,
    ]),
  ],
  declarations: [
    AccountPageComponent,
    AccountListComponent,
    AccountListFilterComponent,
    AccountCardItemComponent,
    AccountRowItemComponent,
    AccountSettingsComponent,
    AccountLimitsComponent,
    AccountStatisticsComponent,
    AccountSidebarComponent,
    AccountDetailsComponent,
    AccountConfigurationComponent,
    AccountPageContainerComponent,
    AccountSidebarContainerComponent,
    AccountDetailsContainerComponent,
    AccountFilterContainerComponent,
    AccountActionsContainerComponent,
    EditAccountConfigurationComponent,
    AccountCreationComponent,
    AccountCreationDialogComponent,
    AccountCreationContainerComponent,
    AccountUsersContainerComponent,
    AccountUsersComponent,
    AccountUserCardComponent,
    AccountUserEditComponent,
    AccountUserEditContainerComponent,
    AccountUserPasswordFormComponent,
    AccountUserPasswordFormContainerComponent,
  ],
  entryComponents: [
    EditAccountConfigurationComponent,
    AccountCreationContainerComponent,
    AccountUserEditContainerComponent,
    AccountUserPasswordFormContainerComponent,
  ],
  exports: [AccountPageComponent],
})
export class AccountModule {}
