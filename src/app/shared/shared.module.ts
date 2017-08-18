import { MdlDialogOutletModule, MdlModule } from '@angular-mdl/core';
import { MdlPopoverModule } from '@angular-mdl/popover';
import { MdlSelectModule } from '@angular-mdl/select';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MdCardModule,
  MdCheckboxModule,
  MdIconModule,
  MdListModule,
  MdProgressBarModule,
  MdProgressSpinnerModule,
  MdRadioModule,
  MdSelectModule,
  MdSliderModule,
  MdSnackBarModule,
  MdTabsModule
} from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';
import { MemoryStorageService } from 'app/shared/services/memory-storage.service';
import { DynamicModule } from 'ng-dynamic-component';
import { DragulaModule } from 'ng2-dragula';
import { MdlDialogModule } from '../dialog/dialog-module';

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
  ListComponent,
  NoResultsComponent,
  NotificationBoxComponent,
  NotificationBoxItemComponent,
  SgRulesManagerComponent,
  SidebarComponent,
  SliderComponent,
  TopBarComponent,
  VmStatisticsComponent
} from './components';
import {
  MDL_SELECT_VALUE_ACCESSOR,
  MdlAutocompleteComponent
} from './components/autocomplete/mdl-autocomplete.component';
import { CharacterCountComponent } from './components/character-count-textfield/character-count.component';
import { CreateUpdateDeleteDialogComponent } from './components/create-update-delete-dialog/create-update-delete-dialog.component';
import { DescriptionComponent } from './components/description/description.component';
import { DividerVerticalComponent } from './components/divider-vertical/divider-vertical.component';
import { FancySelectComponent } from './components/fancy-select/fancy-select.component';
import { GroupedCardListComponent } from './components/grouped-card-list/grouped-card-list.component';
import { InlineEditAutocompleteComponent } from './components/inline-edit/inline-edit-autocomplete.component';
import { InlineEditComponent } from './components/inline-edit/inline-edit.component';
import { InputGroupComponent } from './components/input-group/input-group.component';
import { LoaderComponent } from './components/loader.component';
import { OverlayLoadingComponent } from './components/overlay-loading/overlay-loading.component';
import { ReloadComponent } from './components/reload/reload.component';
import { SearchComponent } from './components/search/search.component';
import { TableComponent } from './components/table/table.component';
import { ForbiddenValuesDirective } from './directives/forbidden-values.directive';
import { IntegerValidatorDirective } from './directives/integer-value.directive';

import { LoadingDirective } from './directives/loading.directive';
import { MaxValueValidatorDirective } from './directives/max-value.directive';
import { MdlTextAreaAutoresizeDirective } from './directives/mdl-textarea-autoresize.directive';
import { MinValueValidatorDirective } from './directives/min-value.directive';

import { DivisionPipe, HighLightPipe, ViewValuePipe } from './pipes';
import { StringifyDatePipe } from './pipes/stringifyDate.pipe';
import { StringifyTimePipe } from './pipes/stringifyTime.pipe';

import {
  AffinityGroupService,
  AsyncJobService,
  AuthGuard,
  AuthService,
  CacheService,
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
  ServiceOfferingFilterService,
  ServiceOfferingService,
  SSHKeyPairService,
  StatsUpdateService,
  StyleService,
  ZoneService
} from './services';
import { DateTimeFormatterService } from './services/date-time-formatter.service';
import { LocalStorageService } from './services/local-storage.service';
import { RouterUtilsService } from './services/router-utils.service';
import { SessionStorageService } from './services/session-storage.service';
import { SnapshotService } from './services/snapshot.service';
import { TagService } from './services/tag.service';
import { UserService } from './services/user.service';
import { VolumeOfferingService } from './services/volume-offering.service';
import { VolumeService } from './services/volume.service';

@NgModule({
  imports: [
    CommonModule,
    DynamicModule.withComponents([GroupedCardListComponent]),
    FormsModule,
    DragulaModule,
    MdCheckboxModule,
    MdSelectModule,
    MdIconModule,
    MdlDialogModule,
    MdlDialogOutletModule,
    MdlModule,
    MdlPopoverModule,
    MdRadioModule,
    MdlSelectModule,
    MdSliderModule,
    TranslateModule,
    MdListModule,
    MdProgressSpinnerModule,
    MdProgressBarModule,
    MdListModule,
    MdSnackBarModule,
    MdCardModule,
    MdTabsModule,
    MdListModule,
    MdSnackBarModule,
    MdCardModule,
    MdTabsModule,
  ],
  exports: [
    GroupedCardListComponent,
    CharacterCountComponent,
    ColorPickerComponent,
    CreateUpdateDeleteDialogComponent,
    DatePickerComponent,
    DividerVerticalComponent,
    DividerVerticalComponent,
    DescriptionComponent,
    DiskOfferingComponent,
    FabComponent,
    FancySelectComponent,
    ForbiddenValuesDirective,
    InlineEditComponent,
    InlineEditAutocompleteComponent,
    InputGroupComponent,
    IntegerValidatorDirective,
    ListComponent,
    NoResultsComponent,
    MaxValueValidatorDirective,
    MinValueValidatorDirective,
    MdlAutocompleteComponent,
    NotificationBoxComponent,
    NotificationBoxItemComponent,
    OverlayLoadingComponent,
    SearchComponent,
    SgRulesManagerComponent,
    SidebarComponent,
    TableComponent,
    TopBarComponent,
    VmStatisticsComponent,
    SliderComponent,
    DivisionPipe,
    HighLightPipe,
    StringifyDatePipe,
    StringifyTimePipe,
    ViewValuePipe,
    LoadingDirective,
    MdlTextAreaAutoresizeDirective,
    MdListModule,
    MdCardModule,
    MdSnackBarModule
  ],
  entryComponents: [
    DatePickerDialogComponent,
    LoaderComponent
  ],
  declarations: [
    CharacterCountComponent,
    CalendarComponent,
    CalendarMonthComponent,
    CalendarYearComponent,
    ColorPickerComponent,
    CreateUpdateDeleteDialogComponent,
    DateDisplayComponent,
    DatePickerComponent,
    DatePickerDialogComponent,
    DescriptionComponent,
    DiskOfferingComponent,
    DividerVerticalComponent,
    FabComponent,
    FancySelectComponent,
    ForbiddenValuesDirective,
    InlineEditComponent,
    InlineEditAutocompleteComponent,
    InputGroupComponent,
    IntegerValidatorDirective,
    ListComponent,
    NoResultsComponent,
    MaxValueValidatorDirective,
    MinValueValidatorDirective,
    MdlAutocompleteComponent,
    MdlTextAreaAutoresizeDirective,
    NotificationBoxComponent,
    NotificationBoxItemComponent,
    OverlayLoadingComponent,
    ReloadComponent,
    SearchComponent,
    SgRulesManagerComponent,
    SidebarComponent,
    TableComponent,
    TopBarComponent,
    VmStatisticsComponent,
    SliderComponent,
    DivisionPipe,
    HighLightPipe,
    StringifyDatePipe,
    StringifyTimePipe,
    ViewValuePipe,
    LoadingDirective,
    LoaderComponent,
    GroupedCardListComponent
  ],
  providers: [
    AffinityGroupService,
    AsyncJobService,
    AuthGuard,
    AuthService,
    CacheService,
    ConfigService,
    DateTimeFormatterService,
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
    RouterUtilsService,
    SecurityGroupService,
    ServiceOfferingService,
    ServiceOfferingFilterService,
    SnapshotService,
    SSHKeyPairService,
    StatsUpdateService,
    MemoryStorageService,
    SessionStorageService,
    LocalStorageService,
    StyleService,
    TagService,
    UserService,
    VolumeService,
    VolumeOfferingService,
    ZoneService,
    MDL_SELECT_VALUE_ACCESSOR
  ]
})
export class SharedModule {
}
