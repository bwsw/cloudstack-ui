import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
  UtilsService,
  VolumeService,
  ZoneService
} from './services';
import { SgRulesManagerComponent } from './components/sg-rules-manager.component';
import { NotificationBoxComponent } from './components/notification-box.component';
import { NotificationBoxItemComponent } from './components/notification-box-item.component';
import { VolumeSizeComponent } from './components/volume-size-control.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    MdlModule,
    MdlPopoverModule
  ],
  exports: [
    SgRulesManagerComponent,
    NotificationBoxComponent,
    NotificationBoxItemComponent,
    VolumeSizeComponent,
    DivByPowerOfTwoPipe,
    ViewValuePipe
  ],
  declarations: [
    SgRulesManagerComponent,
    NotificationBoxComponent,
    NotificationBoxItemComponent,
    VolumeSizeComponent,
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
    UtilsService,
    VolumeService,
    ZoneService,
    { provide: 'INotificationService', useClass: NotificationService },
    { provide: 'IStorageService', useClass: StorageService },
  ]
})
export class SharedModule { }
