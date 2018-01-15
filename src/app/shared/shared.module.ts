import { CdkTableModule } from '@angular/cdk/table';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatDialogModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSnackBarModule,
  MatTableModule,
  MatTabsModule,
  MatTooltipModule
} from '@angular/material';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { MemoryStorageService } from 'app/shared/services/memory-storage.service';
import { DynamicModule } from 'ng-dynamic-component';
import { DragulaModule } from 'ng2-dragula';
import { ClipboardModule } from 'ngx-clipboard';
import { AffinityGroupsEffects } from '../reducers/affinity-groups/redux/affinity-groups.effects';
import { affinityGroupReducers } from '../reducers/affinity-groups/redux/affinity-groups.reducers';
import { DiskOfferingEffects } from '../reducers/disk-offerings/redux/disk-offerings.effects';
import { diskOfferingReducers } from '../reducers/disk-offerings/redux/disk-offerings.reducers';
import { ZonesEffects } from '../reducers/zones/redux/zones.effects';
import { zoneReducers } from '../reducers/zones/redux/zones.reducers';
import { SecurityGroupService } from '../security-group/services/security-group.service';
// tslint:disable-next-line
import { SecurityGroupSelectorComponent } from '../vm/vm-creation/components/security-group-selector/security-group-selector.component';
// tslint:disable-next-line
import { VmCreationSecurityGroupService } from '../vm/vm-creation/services/vm-creation-security-group.service';
import { AccountActionsComponent } from './actions/account-actions/account-actions.component';
import { AccountActionsService } from './actions/account-actions/account-actions.service';
import { AccountUserActionsComponent } from './actions/account-user-actions/account-user-actions.component';
import { AccountUserActionsService } from './actions/account-user-actions/account-user-actions.service';
// tslint:disable-next-line
import { TemplateActionsComponent } from './actions/template-actions/template-actions-component/template-actions.component';
import { TemplateActionsContainerComponent } from './actions/template-actions/template-actions-component/template-actions.container';
import { TemplateActionsService } from './actions/template-actions/template-actions.service';
import { VolumeActionsComponent } from './actions/volume-actions/volume-actions-component/volume-actions.component';
import { VolumeActionsContainerComponent } from './actions/volume-actions/volume-actions.container';
import { VolumeActionsService } from './actions/volume-actions/volume-actions.service';
import { VolumeAttachmentComponent } from './actions/volume-actions/volume-attachment/volume-attachment.component';
// tslint:disable-next-line
import { VolumeAttachmentContainerComponent } from './actions/volume-actions/volume-attachment/volume-attachment.container';
import { VolumeResizeContainerComponent } from './actions/volume-actions/volume-resize.container';
import { VolumeResizeComponent } from './actions/volume-actions/volume-resize/volume-resize.component';
import { BadgeModule } from './badge/';
import {
  CalendarComponent,
  CalendarMonthComponent,
  CalendarYearComponent,
  ColorPickerComponent,
  DateDisplayComponent,
  DatePickerComponent,
  DatePickerDialogComponent,
  FabComponent,
  FancySelectComponent,
  InputGroupComponent,
  ListComponent,
  NoResultsComponent,
  NotificationBoxComponent,
  NotificationBoxItemComponent,
  OverlayLoadingComponent,
  SidebarContainerComponent,
  SliderComponent,
  TopBarComponent,
  VmStatisticsComponent
} from './components';
import { CharacterCountComponent } from './components/character-count-textfield/character-count.component';
// tslint:disable-next-line
import { CreateUpdateDeleteDialogComponent } from './components/create-update-delete-dialog/create-update-delete-dialog.component';
import { DescriptionComponent } from './components/description/description.component';
import { DividerVerticalComponent } from './components/divider-vertical/divider-vertical.component';
import { GroupedListComponent } from './components/grouped-list/grouped-list.component';
import { InlineEditComponent } from './components/inline-edit/inline-edit.component';
import { LoaderComponent } from './components/loader/loader.component';
import { ParametersEditPairComponent } from './components/parameters-pair/parameters-edit-pair.component';
import { ParametersPairComponent } from './components/parameters-pair/parameters-pair.component';
import { PopoverModule } from './components/popover';
import { AnimatedSlashComponent } from './components/progress-logger/animated-slash/animated-slash.component';
// tslint:disable-next-line
import { ProgressLoggerMessageComponent } from './components/progress-logger/progress-logger-message/progress-logger-message.component';
import { ProgressLoggerComponent } from './components/progress-logger/progress-logger/progress-logger.component';
import { ReloadComponent } from './components/reload/reload.component';
import { SearchComponent } from './components/search/search.component';
// tslint:disable-next-line
import { SecurityGroupBuilderRuleComponent } from './components/security-group-builder/rule/security-group-builder-rule.component';
import { SecurityGroupBuilderComponent } from './components/security-group-builder/security-group-builder.component';
// tslint:disable-next-line
import { SecurityGroupManagerBaseTemplatesComponent } from './components/security-group-manager-base-templates/security-group-manager-base-templates.component';
import { TableComponent } from './components/table/table.component';
import { TimeZoneComponent } from './components/time-zone/time-zone.component';
import { TimeZoneService } from './components/time-zone/time-zone.service';
import { ViewModeSwitchComponent } from './components/view-mode-switch/view-mode-switch.component';
import { VmStatisticContainerComponent } from './components/vm-statistics/vm-statistic.container';
import { ForbiddenValuesDirective } from './directives/forbidden-values.directive';
import { IntegerValidatorDirective } from './directives/integer-value.directive';
import { LoadingDirective } from './directives/loading.directive';
import { MaxValueValidatorDirective } from './directives/max-value.directive';
import { MinValueValidatorDirective } from './directives/min-value.directive';
import {
  DivisionPipe,
  HighLightPipe,
  StringifyDatePipe,
  StringifyTimePipe,
  ViewValuePipe,
  VolumeSortPipe
} from './pipes';
import { AccountService } from './services/account.service';
import { AffinityGroupService } from './services/affinity-group.service';
import { AsyncJobService } from './services/async-job.service';
import { AuthGuard } from './services/auth-guard.service';
import { AuthService } from './services/auth.service';
import { CacheService } from './services/cache.service';
import { ConfigService } from './services/config.service';
import { ConfigurationService } from './services/configuration.service';
import { DateTimeFormatterService } from './services/date-time-formatter.service';
import { DiskOfferingService } from './services/disk-offering.service';
import { DomainService } from './services/domain.service';
import { ErrorService } from './services/error.service';
import { HypervisorService } from './services/hypervisor.service';
import { InstanceGroupService } from './services/instance-group.service';
import { JobsNotificationService } from './services/jobs-notification.service';
import { LanguageService } from './services/language.service';
import { LayoutService } from './services/layout.service';
import { LocalStorageService } from './services/local-storage.service';
import { LoginGuard } from './services/login-guard.service';
import { NotificationService } from './services/notification.service';
import { OsTypeService } from './services/os-type.service';
import { ResourceCountService } from './services/resource-count.service';
import { ResourceLimitService } from './services/resource-limit.service';
import { ResourceUsageService } from './services/resource-usage.service';
import { RoleService } from './services/role.service';
import { RouterUtilsService } from './services/router-utils.service';
import { ServiceOfferingService } from './services/service-offering.service';
import { SessionStorageService } from './services/session-storage.service';
import { SnapshotService } from './services/snapshot.service';
import { SSHKeyPairService } from './services/ssh-keypair.service';
import { StyleService } from './services/style.service';
import { AccountTagService } from './services/tags/account-tag.service';
import { DescriptionTagService } from './services/tags/description-tag.service';
import { MarkForRemovalService } from './services/tags/mark-for-removal.service';
import { SecurityGroupTagService } from './services/tags/security-group-tag.service';
import { SnapshotTagService } from './services/tags/snapshot-tag.service';
import { TagService } from './services/tags/tag.service';
import { TemplateTagService } from './services/tags/template-tag.service';
import { UserTagService } from './services/tags/user-tag.service';
import { VmTagService } from './services/tags/vm-tag.service';
import { VolumeTagService } from './services/tags/volume-tag.service';
import { UserService } from './services/user.service';
import { VolumeService } from './services/volume.service';
import { ZoneService } from './services/zone.service';

@NgModule({
  imports: [
    CommonModule,
    DynamicModule.withComponents([GroupedListComponent]),
    FormsModule,
    BadgeModule,
    CdkTableModule,
    ClipboardModule,
    DragulaModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatDialogModule,
    MatCardModule,
    MatCheckboxModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSnackBarModule,
    MatTableModule,
    CdkTableModule,
    MatAutocompleteModule,
    MatInputModule,
    MatTooltipModule,
    MatTabsModule,
    PopoverModule,
    TranslateModule,
    MatButtonToggleModule,
    StoreModule.forFeature('zones', zoneReducers),
    StoreModule.forFeature('disk-offerings', diskOfferingReducers),
    StoreModule.forFeature('affinity-groups', affinityGroupReducers),
    EffectsModule.forFeature([ZonesEffects, DiskOfferingEffects, AffinityGroupsEffects]),
  ],
  exports: [
    CdkTableModule,
    AccountActionsComponent,
    CharacterCountComponent,
    ColorPickerComponent,
    CreateUpdateDeleteDialogComponent,
    DatePickerComponent,
    DescriptionComponent,
    DividerVerticalComponent,
    DivisionPipe,
    VolumeSortPipe,
    FabComponent,
    FancySelectComponent,
    ForbiddenValuesDirective,
    GroupedListComponent,
    HighLightPipe,
    InlineEditComponent,
    InputGroupComponent,
    IntegerValidatorDirective,
    ListComponent,
    ViewModeSwitchComponent,
    LoadingDirective,
    MaxValueValidatorDirective,
    MatAutocompleteModule,
    MatCardModule,
    MatInputModule,
    MatListModule,
    MatSnackBarModule,
    MatTableModule,
    MinValueValidatorDirective,
    NoResultsComponent,
    NotificationBoxComponent,
    NotificationBoxItemComponent,
    OverlayLoadingComponent,
    SearchComponent,
    SidebarContainerComponent,
    SliderComponent,
    VolumeActionsComponent,
    StringifyTimePipe,
    StringifyDatePipe,
    TableComponent,
    TemplateActionsComponent,
    MatAutocompleteModule,
    MatInputModule,
    ProgressLoggerComponent,
    ProgressLoggerMessageComponent,
    AnimatedSlashComponent,
    SecurityGroupBuilderComponent,
    SecurityGroupSelectorComponent,
    SecurityGroupManagerBaseTemplatesComponent,
    TemplateActionsComponent,
    MatAutocompleteModule,
    MatInputModule,
    TimeZoneComponent,
    TopBarComponent,
    ViewValuePipe,
    VmStatisticsComponent,
    VmStatisticContainerComponent,
    ParametersPairComponent,
    ParametersEditPairComponent,
    VolumeActionsContainerComponent,
    VolumeResizeContainerComponent,
    VolumeResizeComponent,
    TemplateActionsContainerComponent,
    VolumeAttachmentComponent,
    AccountUserActionsComponent,
  ],
  entryComponents: [
    DatePickerDialogComponent,
    LoaderComponent,
    VolumeAttachmentContainerComponent,
    VolumeResizeContainerComponent,
    VolumeResizeComponent,
    SecurityGroupBuilderComponent
  ],
  declarations: [
    AccountActionsComponent,
    CalendarComponent,
    CalendarMonthComponent,
    CalendarYearComponent,
    CharacterCountComponent,
    ColorPickerComponent,
    CreateUpdateDeleteDialogComponent,
    DateDisplayComponent,
    DatePickerComponent,
    DatePickerDialogComponent,
    DescriptionComponent,
    DividerVerticalComponent,
    DivisionPipe,
    VolumeSortPipe,
    FabComponent,
    FancySelectComponent,
    ForbiddenValuesDirective,
    GroupedListComponent,
    HighLightPipe,
    InlineEditComponent,
    InputGroupComponent,
    IntegerValidatorDirective,
    ListComponent,
    ViewModeSwitchComponent,
    LoaderComponent,
    LoadingDirective,
    MaxValueValidatorDirective,
    MinValueValidatorDirective,
    NoResultsComponent,
    NotificationBoxComponent,
    NotificationBoxItemComponent,
    OverlayLoadingComponent,
    ReloadComponent,
    SearchComponent,
    SecurityGroupBuilderRuleComponent,
    SidebarContainerComponent,
    SliderComponent,
    VolumeActionsComponent,
    StringifyDatePipe,
    StringifyTimePipe,
    TableComponent,
    TemplateActionsComponent,
    TopBarComponent,
    ViewValuePipe,
    LoadingDirective,
    LoaderComponent,
    GroupedListComponent,
    TemplateActionsComponent,
    ProgressLoggerComponent,
    ProgressLoggerMessageComponent,
    AnimatedSlashComponent,
    LoadingDirective,
    LoaderComponent,
    VolumeActionsComponent,
    TemplateActionsComponent,
    SecurityGroupBuilderComponent,
    SecurityGroupSelectorComponent,
    SecurityGroupManagerBaseTemplatesComponent,
    VmStatisticsComponent,
    VmStatisticContainerComponent,
    TimeZoneComponent,
    ParametersPairComponent,
    ParametersEditPairComponent,
    VolumeActionsContainerComponent,
    VolumeResizeContainerComponent,
    VolumeResizeComponent,
    TemplateActionsContainerComponent,
    VolumeAttachmentContainerComponent,
    VolumeAttachmentComponent,
    AccountUserActionsComponent,
  ],
  providers: [
    AccountService,
    AccountActionsService,
    AffinityGroupService,
    AsyncJobService,
    AuthGuard,
    AuthService,
    CacheService,
    ConfigService,
    ConfigurationService,
    DateTimeFormatterService,
    DescriptionTagService,
    DiskOfferingService,
    DomainService,
    ErrorService,
    InstanceGroupService,
    JobsNotificationService,
    LanguageService,
    LayoutService,
    LocalStorageService,
    LoginGuard,
    MarkForRemovalService,
    MemoryStorageService,
    NotificationService,
    OsTypeService,
    ResourceCountService,
    ResourceLimitService,
    ResourceUsageService,
    RoleService,
    RouterUtilsService,
    SSHKeyPairService,
    SecurityGroupService,
    SecurityGroupTagService,
    ServiceOfferingService,
    SessionStorageService,
    SnapshotService,
    SnapshotTagService,
    VolumeActionsService,
    StyleService,
    TagService,
    TemplateActionsService,
    TemplateTagService,
    UserService,
    UserTagService,
    AccountTagService,
    VmTagService,
    ZoneService,
    VmCreationSecurityGroupService,
    VolumeService,
    VolumeTagService,
    ZoneService,
    HypervisorService,
    TimeZoneService,
    AccountUserActionsService
  ]
})
export class SharedModule {
}
