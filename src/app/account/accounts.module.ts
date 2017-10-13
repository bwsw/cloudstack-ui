import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountPageComponent } from './account-page/account-page.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AccountListComponent } from './account-list/account-list.component';
import { AccountListFilterComponent } from './account-list-filter/account-list-filter.component';
import {
  MdButtonModule,
  MdIconModule,
  MdMenuModule,
  MdSelectModule,
  MdTabsModule,
  MdTooltipModule
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
import { AccountsEffects } from './redux/accounts.effects';
import { DomainsEffects } from '../domains/redux/domains.effects';
import { RolesEffects } from '../roles/redux/roles.effects';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { accountReducers } from './redux/accounts.reducers';
import { domainReducers } from '../domains/redux/domains.reducers'
import { roleReducers } from '../roles/redux/roles.reducers';
import { DraggableSelectModule } from '../shared/components/draggable-select/draggable-select.module';
import { AccountSidebarContainer } from './account-container/accoun

@NgModule({
  imports: [
    CommonModule,
    DynamicModule.withComponents([AccountItemComponent]),
    FormsModule,
    MdMenuModule,
    MdTooltipModule,
    MdTabsModule,
    MdButtonModule,
    MdSelectModule,
    MdIconModule,
    RouterModule,
    SharedModule,
    TranslateModule,
    DraggableSelectModule,
    StoreModule.forFeature('accounts', accountReducers),
    StoreModule.forFeature('domains', domainReducers),
    StoreModule.forFeature('roles', roleReducers),
    EffectsModule.forFeature([AccountsEffects, DomainsEffects, RolesEffects]),
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
    AccountSidebarContainer,
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
