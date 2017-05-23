import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MdlPopoverModule } from '@angular-mdl/popover';
import { MdlSelectModule } from '@angular-mdl/select';
import { MdlModule } from '@angular-mdl/core';
import { TranslateModule } from '@ngx-translate/core';

import {
  DivisionPipe,
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
  LayoutService,
  LoginGuard,
  NotificationService,
  OsTypeService,
  ResourceLimitService,
  ResourceUsageService,
  SecurityGroupService,
  ServiceOfferingService,
  ServiceOfferingFilterService,
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
  ListComponent,
  DiskOfferingComponent,
  FabComponent,
  NoResultsComponent,
  NotificationBoxComponent,
  NotificationBoxItemComponent,
  SgRulesManagerComponent,
  SidebarComponent,
  TopBarComponent,
  VmStatisticsComponent,
  SliderComponent
} from './components';

import { MaxValueValidatorDirective } from './directives/max-value.directive';
import { MinValueValidatorDirective } from './directives/min-value.directive';

import { LoadingDirective } from './directives/loading.directive';
import { LoaderComponent } from './components/loader.component';
import { UserService } from './services/user.service';
import { FilterService } from './services';
import { IntegerValidatorDirective } from './directives/integer-value.directive';
import { DialogService } from './services/dialog/dialog.service';
import { InlineEditComponent } from './components/inline-edit/inline-edit.component';
import { InlineEditAutocompleteComponent } from './components/inline-edit/inline-edit-autocomplete.component';
import {
  MDL_SELECT_VALUE_ACCESSOR,
  MdlAutocompleteComponent
} from './components/autocomplete/mdl-autocomplete.component';
import { DescriptionComponent } from './components/description/description.component';
import { SearchComponent } from './components/search/search.component';
import { TableComponent } from './components/table/table.component';
import { CustomSimpleDialogComponent } from './services/dialog/custom-dialog.component';
import { FancySelectComponent } from './components/fancy-select/fancy-select.component';


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
    DescriptionComponent,
    DiskOfferingComponent,
    FabComponent,
    FancySelectComponent,
    InlineEditComponent,
    InlineEditAutocompleteComponent,
    IntegerValidatorDirective,
    ListComponent,
    NoResultsComponent,
    MaxValueValidatorDirective,
    MinValueValidatorDirective,
    MdlAutocompleteComponent,
    NotificationBoxComponent,
    NotificationBoxItemComponent,
    SearchComponent,
    SgRulesManagerComponent,
    SidebarComponent,
    TableComponent,
    TopBarComponent,
    VmStatisticsComponent,
    DivisionPipe,
    SliderComponent,
    HighLightPipe,
    ViewValuePipe,
    LoadingDirective
  ],
  entryComponents: [
    CustomSimpleDialogComponent,
    DatePickerDialogComponent,
    LoaderComponent
  ],
  declarations: [
    CalendarComponent,
    CalendarMonthComponent,
    CalendarYearComponent,
    ColorPickerComponent,
    CustomSimpleDialogComponent,
    DateDisplayComponent,
    DatePickerComponent,
    DatePickerDialogComponent,
    DescriptionComponent,
    DiskOfferingComponent,
    FabComponent,
    FancySelectComponent,
    InlineEditComponent,
    InlineEditAutocompleteComponent,
    IntegerValidatorDirective,
    ListComponent,
    NoResultsComponent,
    MaxValueValidatorDirective,
    MinValueValidatorDirective,
    MdlAutocompleteComponent,
    NotificationBoxComponent,
    NotificationBoxItemComponent,
    SearchComponent,
    SgRulesManagerComponent,
    SidebarComponent,
    TableComponent,
    TopBarComponent,
    VmStatisticsComponent,
    DivisionPipe,
    SliderComponent,
    HighLightPipe,
    ViewValuePipe,
    LoadingDirective,
    LoaderComponent
  ],
  providers: [
    AffinityGroupService,
    AsyncJobService,
    AuthGuard,
    AuthService,
    ConfigService,
    DialogService,
    DiskOfferingService,
    DiskStorageService,
    ErrorService,
    FilterService,
    InstanceGroupService,
    JobsNotificationService,
    LanguageService,
    LayoutService,
    LoginGuard,
    NotificationService,
    OsTypeService,
    ResourceLimitService,
    ResourceUsageService,
    SecurityGroupService,
    ServiceOfferingService,
    ServiceOfferingFilterService,
    SnapshotService,
    SSHKeyPairService,
    StatsUpdateService,
    StorageService,
    StyleService,
    TagService,
    UserService,
    UtilsService,
    VolumeService,
    ZoneService,
    { provide: 'INotificationService', useClass: NotificationService },
    { provide: 'IStorageService', useClass: StorageService },
    MDL_SELECT_VALUE_ACCESSOR
  ]
})
export class SharedModule { }
