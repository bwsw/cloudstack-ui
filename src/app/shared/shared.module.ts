import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdlPopoverModule } from '@angular2-mdl-ext/popover';
import { MdlModule } from 'angular2-mdl';
import { TranslateModule } from 'ng2-translate';

import { DivByPowerOfTwoPipe } from './pipes/div-by-power-of-two.pipe';
import { ViewValuePipe } from './pipes/view-value.pipe';
import {
  AffinityGroupService,
  AsyncJobService,
  AuthGuard,
  AuthService,
  ConfigService,
  DiskStorageService,
  ErrorService,
  JobsNotificationService,
  LoginGuard,
  NotificationService,
  OsTypeService,
  ResourceLimitService,
  ResourceUsageService,
  SecurityGroupService,
  ServiceOfferingFilterService,
  ServiceOfferingService,
  SnapshotService,
  SSHKeyPairService,
  StatsUpdateService,
  StorageService,
  TagService,
  UtilsService,
  VolumeService,
  ZoneService
} from './services';
import { SgRulesManagerComponent } from './components/sg-rules-manager.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { NotificationBoxComponent } from './components/notification-box.component';
import { NotificationBoxItemComponent } from './components/notification-box-item.component';
import { HighLightPipe } from './pipes/highlight.pipe';


@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    MdlModule,
    MdlPopoverModule
  ],
  exports: [
    SgRulesManagerComponent,
    SidebarComponent,
    NotificationBoxComponent,
    NotificationBoxItemComponent,
    DivByPowerOfTwoPipe,
    ViewValuePipe,
    HighLightPipe
  ],
  declarations: [
    SgRulesManagerComponent,
    SidebarComponent,
    NotificationBoxComponent,
    NotificationBoxItemComponent,
    DivByPowerOfTwoPipe,
    ViewValuePipe,
    HighLightPipe
  ],
  providers: [
    AffinityGroupService,
    AsyncJobService,
    AuthGuard,
    AuthService,
    ConfigService,
    DiskStorageService,
    ErrorService,
    JobsNotificationService,
    LoginGuard,
    NotificationService,
    OsTypeService,
    ResourceLimitService,
    ResourceUsageService,
    SSHKeyPairService,
    SecurityGroupService,
    ServiceOfferingFilterService,
    ServiceOfferingService,
    SnapshotService,
    StatsUpdateService,
    StorageService,
    TagService,
    UtilsService,
    VolumeService,
    ZoneService,
    { provide: 'INotificationService', useClass: NotificationService },
    { provide: 'IStorageService', useClass: StorageService },
  ]
})
export class SharedModule { }
