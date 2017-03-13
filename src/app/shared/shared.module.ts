import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MdlPopoverModule } from '@angular2-mdl-ext/popover';
import { MdlSelectModule } from '@angular2-mdl-ext/select';
import { MdlModule } from 'angular2-mdl';
import { TranslateModule } from 'ng2-translate';

import {
  DivByPowerOfTwoPipe,
  HighLightPipe,
  ViewValuePipe
} from './pipes';

import {
  AffinityGroupService,
  AsyncJobService,
  AuthGuard,
  AuthService,
  ConfigService,
  DiskOfferingService,
  DiskStorageService,
  ErrorService,
  InstanceGroupService,
  JobsNotificationService,
  LanguageService,
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
  StyleService,
  TagService,
  UtilsService,
  VolumeService,
  ZoneService
} from './services';

import {
  CalendarComponent,
  CalendarMonthComponent,
  CalendarYearComponent,
  ColorPickerComponent,
  DateDisplayComponent,
  DatePickerComponent,
  DatePickerDialogComponent,
  DiskOfferingComponent,
  FabComponent,
  NotificationBoxComponent,
  NotificationBoxItemComponent,
  SgRulesManagerComponent,
  SidebarComponent,
  VmStatisticsComponent,
  SliderComponent
} from './components';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MdlModule,
    MdlPopoverModule,
    MdlSelectModule,
    TranslateModule
  ],
  exports: [
    ColorPickerComponent,
    DatePickerComponent,
    DiskOfferingComponent,
    FabComponent,
    NotificationBoxComponent,
    NotificationBoxItemComponent,
    SgRulesManagerComponent,
    SidebarComponent,
    VmStatisticsComponent,
    SliderComponent,
    DivByPowerOfTwoPipe,
    HighLightPipe,
    ViewValuePipe
  ],
  entryComponents: [
    DatePickerDialogComponent
  ],
  declarations: [
    CalendarComponent,
    CalendarMonthComponent,
    CalendarYearComponent,
    ColorPickerComponent,
    DateDisplayComponent,
    DatePickerComponent,
    DatePickerDialogComponent,
    DiskOfferingComponent,
    FabComponent,
    NotificationBoxComponent,
    NotificationBoxItemComponent,
    SgRulesManagerComponent,
    SidebarComponent,
    VmStatisticsComponent,
    SliderComponent,
    DivByPowerOfTwoPipe,
    HighLightPipe,
    ViewValuePipe,
  ],
  providers: [
    AffinityGroupService,
    AsyncJobService,
    AuthGuard,
    AuthService,
    ConfigService,
    DiskOfferingService,
    DiskStorageService,
    ErrorService,
    InstanceGroupService,
    JobsNotificationService,
    LanguageService,
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
    StyleService,
    TagService,
    UtilsService,
    VolumeService,
    ZoneService,
    { provide: 'INotificationService', useClass: NotificationService },
    { provide: 'IStorageService', useClass: StorageService },
  ]
})
export class SharedModule { }
