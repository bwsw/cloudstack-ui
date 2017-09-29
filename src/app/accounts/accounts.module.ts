import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountPageComponent } from './account-page/account-page.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AccountListComponent } from './account-list/account-list.component';
import { DraggableSelectModule } from '../shared/components/draggable-select/draggable-select.module';
import { AccountListFilterComponent } from './account-list-filter/account-list-filter.component';
import { MdMenuModule, MdSelectModule, MdTooltipModule } from '@angular/material';
import { AccountItemComponent } from './account/account-item.component';
import { DynamicModule } from 'ng-dynamic-component';
import { AccountStatisticsComponent } from './account-sidebar/account-statistic/account-statistics.component';
import { AccountLimitsComponent } from './account-sidebar/account-limits/account-limits.component';
import { AccountSettingsComponent } from './account-sidebar/account-settings/account-settings.component';
import { AccountSidebarComponent } from './account-sidebar/account-sidebar.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  imports: [
    CommonModule,
    DynamicModule.withComponents([AccountItemComponent]),
    FormsModule,
    MdMenuModule,
    MdTooltipModule,
    MdSelectModule,
    RouterModule,
    SharedModule,
    TranslateModule,
    DraggableSelectModule
  ],
  declarations: [
    AccountPageComponent,
    AccountListComponent,
    AccountListFilterComponent,
    AccountItemComponent,
    AccountSettingsComponent,
    AccountLimitsComponent,
    AccountStatisticsComponent,
    AccountSidebarComponent
  ],
  exports: [
    AccountPageComponent
  ]
})
export class AccountModule {}
