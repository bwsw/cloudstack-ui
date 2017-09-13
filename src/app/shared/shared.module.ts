import { MdlModule } from '@angular-mdl/core';
import { MdlPopoverModule } from '@angular-mdl/popover';
import { MdlSelectModule } from '@angular-mdl/select';
import { CdkTableModule } from '@angular/cdk';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MdAutocompleteModule,
  MdCardModule,
  MdIconModule,
  MdInputModule,
  MdListModule,
  MdMenuModule,
  MdSelectModule,
  MdSnackBarModule,
  MdTableModule,
  MdTabsModule, MdTooltipModule
} from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';
import { MemoryStorageService } from 'app/shared/services/memory-storage.service';
import { DynamicModule } from 'ng-dynamic-component';
import { DragulaModule } from 'ng2-dragula';
// tslint:disable-next-line
import { SecurityGroupSelectorComponent } from '../vm/vm-creation/components/security-group-selector/security-group-selector.component';
// tslint:disable-next-line
import { VmCreationSecurityGroupService } from '../vm/vm-creation/services/vm-creation-security-group.service';
import { SpareDriveActionsComponent } from './actions/spare-drive-actions/spare-drive-actions-component/spare-drive-actions.component';
import { SpareDriveActionsService } from './actions/spare-drive-actions/spare-drive-actions.service';
import { SpareDriveAttachAction } from './actions/spare-drive-actions/spare-drive-attach';
// tslint:disable-next-line
import { SpareDriveAttachmentComponent } from './actions/spare-drive-actions/spare-drive-attachment/spare-drive-attachment.component';
import { SpareDriveDetachAction } from './actions/spare-drive-actions/spare-drive-detach';
import { SpareDriveRecurringSnapshotsAction } from './actions/spare-drive-actions/spare-drive-recurring-snapshots';
import { SpareDriveRemoveAction } from './actions/spare-drive-actions/spare-drive-remove';
import { SpareDriveResizeAction } from './actions/spare-drive-actions/spare-drive-resize';
import { SpareDriveSnapshotAction } from './actions/spare-drive-actions/spare-drive-snapshot';
// tslint:disable-next-line
import { TemplateActionsComponent } from './actions/template-actions/template-actions-component/template-actions.component';
import { TemplateActionsService } from './actions/template-actions/template-actions.service';
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
  SidebarContainerComponent,
  SliderComponent,
  TopBarComponent,
  VmStatisticsComponent
} from './components';
import {
  MDL_SELECT_VALUE_ACCESSOR,
  MdlAutocompleteComponent
} from './components/autocomplete/mdl-autocomplete.component';
import { CharacterCountComponent } from './components/character-count-textfield/character-count.component';
// tslint:disable-next-line
import { CreateUpdateDeleteDialogComponent } from './components/create-update-delete-dialog/create-update-delete-dialog.component';
import { DescriptionComponent } from './components/description/description.component';
import { DividerVerticalComponent } from './components/divider-vertical/divider-vertical.component';
import { FancySelectComponent } from './components/fancy-select/fancy-select.component';
import { GroupedCardListComponent } from './components/grouped-card-list/grouped-card-list.component';
import { InlineEditAutocompleteComponent } from './components/inline-edit/inline-edit-autocomplete.component';
import { InlineEditComponent } from './components/inline-edit/inline-edit.component';
import { InputGroupComponent } from './components/input-group/input-group.component';
import { LoaderComponent } from './components/loader/loader.component';
import { OverlayLoadingComponent } from './components/overlay-loading/overlay-loading.component';
import { ReloadComponent } from './components/reload/reload.component';
import { SearchComponent } from './components/search/search.component';
// tslint:disable-next-line
import { SecurityGroupBuilderRuleComponent } from './components/security-group-builder/rule/security-group-builder-rule.component';
import { SecurityGroupBuilderComponent } from './components/security-group-builder/security-group-builder.component';
// tslint:disable-next-line
import { SecurityGroupManagerBaseTemplatesComponent } from './components/security-group-manager-base-templates/security-group-manager-base-templates.component';
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
import { AccountService } from './services/account.service';
import { AffinityGroupService } from './services/affinity-group.service';
import { AsyncJobService } from './services/async-job.service';
import { AuthGuard } from './services/auth-guard.service';
import { AuthService } from './services/auth.service';
import { CacheService } from './services/cache.service';
import { ConfigService } from './services/config.service';
import { DateTimeFormatterService } from './services/date-time-formatter.service';
import { DiskOfferingService } from './services/disk-offering.service';
import { ErrorService } from './services/error.service';
import { InstanceGroupService } from './services/instance-group.service';
import { JobsNotificationService } from './services/jobs-notification.service';
import { LanguageService } from './services/language.service';
import { LayoutService } from './services/layout.service';
import { LocalStorageService } from './services/local-storage.service';
import { LoginGuard } from './services/login-guard.service';
import { NotificationService } from './services/notification.service';
import { OsTypeService } from './services/os-type.service';
import { ResourceLimitService } from './services/resource-limit.service';
import { ResourceUsageService } from './services/resource-usage.service';
import { RouterUtilsService } from './services/router-utils.service';
import { ServiceOfferingService } from './services/service-offering.service';
import { SessionStorageService } from './services/session-storage.service';
import { SnapshotService } from './services/snapshot.service';
import { SSHKeyPairService } from './services/ssh-keypair.service';
import { StatsUpdateService } from './services/stats-update.service';
import { StyleService } from './services/style.service';
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
import { VolumeOfferingService } from './services/volume-offering.service';
import { VolumeService } from './services/volume.service';
import { ZoneService } from './services/zone.service';
import { SecurityGroupService } from '../security-group/services/security-group.service';


@NgModule({
  imports: [
    CommonModule,
    DynamicModule.withComponents([GroupedCardListComponent]),
    FormsModule,
    DragulaModule,
    MdSelectModule,
    MdIconModule,
    MdlModule,
    MdlPopoverModule,
    MdlSelectModule,
    TranslateModule,
    MdListModule,
    MdSnackBarModule,
    MdTabsModule,
    MdMenuModule,
    MdCardModule,
    MdTableModule,
    CdkTableModule,
    MdAutocompleteModule,
    MdInputModule,
    MdTooltipModule
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
    SidebarContainerComponent,
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
    MdTableModule,
    CdkTableModule,
    MdSnackBarModule,
    SpareDriveActionsComponent,
    TemplateActionsComponent,
    SecurityGroupBuilderComponent,
    SecurityGroupSelectorComponent,
    SecurityGroupManagerBaseTemplatesComponent,
    TemplateActionsComponent,
    MdAutocompleteModule,
    MdInputModule
  ],
  entryComponents: [
    DatePickerDialogComponent,
    LoaderComponent,
    SecurityGroupBuilderComponent,
    SpareDriveAttachmentComponent
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
    SecurityGroupBuilderRuleComponent,
    SidebarContainerComponent,
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
    GroupedCardListComponent,
    SpareDriveActionsComponent,
    TemplateActionsComponent,
    SecurityGroupBuilderComponent,
    SecurityGroupSelectorComponent,
    SecurityGroupManagerBaseTemplatesComponent
  ],
  providers: [
    AccountService,
    SpareDriveActionsService,
    SpareDriveSnapshotAction,
    SpareDriveRecurringSnapshotsAction,
    SpareDriveAttachAction,
    SpareDriveDetachAction,
    SpareDriveRemoveAction,
    SpareDriveResizeAction,
    TemplateActionsService,
    DescriptionTagService,
    MarkForRemovalService,
    SecurityGroupTagService,
    SnapshotTagService,
    TemplateTagService,
    UserTagService,
    VmTagService,
    VolumeTagService,
    AffinityGroupService,
    AsyncJobService,
    AuthGuard,
    AuthService,
    CacheService,
    ConfigService,
    DateTimeFormatterService,
    DiskOfferingService,
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
    MDL_SELECT_VALUE_ACCESSOR,
    VmCreationSecurityGroupService
  ]
})
export class SharedModule {
}
