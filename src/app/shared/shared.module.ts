import { NgModule } from '@angular/core';

import { DivByPowerOfTwoPipe } from './pipes/div-by-power-of-two.pipe';
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
  ServiceOfferingFilterService,
  ServiceOfferingService,
  SnapshotService,
  SSHKeyPairService,
  StorageService,
  TagService,
  TemplateService,
  VolumeService,
  ZoneService
} from './services';


@NgModule({
  exports: [ DivByPowerOfTwoPipe ],
  declarations: [
    DivByPowerOfTwoPipe
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
    ServiceOfferingFilterService,
    ServiceOfferingService,
    SnapshotService,
    TagService,
    TemplateService,
    VolumeService,
    ZoneService,
    { provide: 'INotificationService', useClass: NotificationService },
    { provide: 'IStorageService', useClass: StorageService },
  ]
})
export class SharedModule { }
