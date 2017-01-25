import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  IsoService,
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
  TemplateService,
  VolumeService,
  ZoneService
} from './services';
import { SgRulesManagerComponent } from './components/sg-rules-manager.component';


@NgModule({
  imports: [
    CommonModule,
    TranslateModule
  ],
  exports: [
    SgRulesManagerComponent,
    DivByPowerOfTwoPipe,
    ViewValuePipe
  ],
  declarations: [
    SgRulesManagerComponent,
    DivByPowerOfTwoPipe,
    ViewValuePipe
  ],
  providers: [
    AffinityGroupService,
    AsyncJobService,
    AuthGuard,
    AuthService,
    ConfigService,
    DiskStorageService,
    ErrorService,
    IsoService,
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
    TagService,
    TemplateService,
    VolumeService,
    ZoneService,
    { provide: 'INotificationService', useClass: NotificationService },
    { provide: 'IStorageService', useClass: StorageService },
  ]
})
export class SharedModule { }
