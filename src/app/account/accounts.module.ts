import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountPageComponent } from './account-page/account-page.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AccountListComponent } from './account-list/account-list.component';
import { AccountListFilterComponent } from './account-list-filter/account-list-filter.component';
import {
  MatButtonModule,
  MatIconModule,
  MatMenuModule,
  MatSelectModule,
  MatTabsModule,
  MatTooltipModule,
  MatInputModule
} from '@angular/material';
import { AccountItemComponent } from './account/account-item.component';
import { DynamicModule } from 'ng-dynamic-component';
import { AccountStatisticsComponent } from './account-sidebar/account-statistic/account-statistics.component';
import { AccountLimitsComponent } from './account-sidebar/account-limits/account-limits.component';
import { AccountSettingsComponent } from './account-sidebar/account-settings/account-settings.component';
import { AccountSidebarComponent } from './account-sidebar/account-sidebar.component';
import { FormsModule } from '@angular/forms';
import { AccountDetailsComponent } from './account-sidebar/account-details/account-details.component';
import { AccountConfigurationComponent } from './account-sidebar/account-settings/account-configuration/account-configuration.component';
import { EditAccountConfigurationComponent } from './account-sidebar/account-settings/account-configuration/edit-account-configuration.component';
import { AccountPageContainerComponent } from './account-container/account.container';
import { AccountsEffects } from '../reducers/accounts/redux/accounts.effects';
import { DomainsEffects } from '../reducers/domains/redux/domains.effects';
import { RolesEffects } from '../reducers/roles/redux/roles.effects';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { accountReducers } from '../reducers/accounts/redux/accounts.reducers';
import { domainReducers } from '../reducers/domains/redux/domains.reducers'
import { roleReducers } from '../reducers/roles/redux/roles.reducers';
import { DraggableSelectModule } from '../shared/components/draggable-select/draggable-select.module';
import { AccountSidebarContainerComponent } from './account-container/account-sidebar.container';
import { AccountDetailsContainerComponent } from './account-container/account-details.container';
import { configurationReducers } from '../reducers/configuration/redux/configurations.reducers';
import { ConfigurationEffects } from '../reducers/configuration/redux/configurations.effects';
import { resourceLimitsReducers } from '../reducers/resource-limit/redux/resource-limits.reducers';
import { ResourceLimitsEffects } from '../reducers/resource-limit/redux/resource-limits.effects';
import { ResourceCountsEffects } from '../reducers/resource-count/redux/resource-counts.effects';
import { resourceCountsReducers } from '../reducers/resource-count/redux/resource-counts.reducers';

@NgModule({
  imports: [
    CommonModule,
    DynamicModule.withComponents([AccountItemComponent]),
    FormsModule,
    MatMenuModule,
    MatTooltipModule,
    MatTabsModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatInputModule,
    RouterModule,
    SharedModule,
    TranslateModule,
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
      ResourceCountsEffects
    ]),
  ],
  declarations: [
    AccountPageComponent,
    AccountListComponent,
    AccountListFilterComponent,
    AccountItemComponent,
    AccountSettingsComponent,
    AccountLimitsComponent,
    AccountStatisticsComponent,
    AccountSidebarComponent,
    AccountDetailsComponent,
    AccountConfigurationComponent,
    AccountPageContainerComponent,
    AccountSidebarContainerComponent,
    AccountDetailsContainerComponent,
    EditAccountConfigurationComponent,
  ],
  entryComponents: [
    EditAccountConfigurationComponent
  ],
  exports: [
    AccountPageComponent
  ]
})
export class AccountModule {}
