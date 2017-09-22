import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountPageComponent } from './account-page/account-page.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AccountListComponent } from './account-list/account-list.component';
import { DraggableSelectModule } from '../shared/components/draggable-select/draggable-select.module';
import { AccountFilterComponent } from './account-filter/account-filter.component';
import { MdMenuModule, MdTooltipModule } from '@angular/material';
import { AccountItemComponent } from './account/account-item.component';
import { DynamicModule } from 'ng-dynamic-component';
import { AccountStatisticsComponent } from './account-sidebar/account-statistic/account-statistics.component';
import { AccountLimitsComponent } from './account-sidebar/account-limits/account-limits.component';
import { AccountSettingsComponent } from './account-sidebar/account-settings/account-settings.component';
import { AccountSidebarComponent } from './account-sidebar/account-sidebar.component';


@NgModule({
  imports: [
    CommonModule,
    DynamicModule.withComponents([AccountItemComponent]),
    MdMenuModule,
    MdTooltipModule,
    RouterModule,
    SharedModule,
    TranslateModule,
    DraggableSelectModule
  ],
  declarations: [
    AccountPageComponent,
    AccountListComponent,
    AccountFilterComponent,
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
export class UsersModule {}
