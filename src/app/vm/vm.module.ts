import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCheckboxModule,
  MatDialogModule,
  MatIconModule,
  MatInputModule,
  MatMenuModule,
  MatProgressBarModule,
  MatSelectModule,
  MatTabsModule,
  MatTooltipModule
} from '@angular/material';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { DynamicModule } from 'ng-dynamic-component';
import { PulseModule } from '../pulse/pulse.module';
import { ServiceOfferingModule } from '../service-offering/service-offering.module';
import { DraggableSelectModule } from '../shared/components/draggable-select/draggable-select.module';
import { SharedModule } from '../shared/shared.module';
import { SnapshotActionsService } from '../snapshot/snapshot-actions.service';
// tslint:disable-next-line
import { SnapshotModule } from '../snapshot/snapshot.module';
import { TagsModule } from '../tags/tags.module';
import { TemplateModule } from '../template';
import { VmActionsService } from './shared/vm-actions.service';
import { VmDestroyDialogComponent } from './shared/vm-destroy-dialog/vm-destroy-dialog.component';
import { VmEntityDeletionService } from './shared/vm-entity-deletion.service';
import { VmService } from './shared/vm.service';
import { VmActionsComponent } from './vm-actions/vm-actions-component/vm-actions.component';
import { VmActionProviders } from './vm-actions/index';
// tslint:disable-next-line
import { VmCreationSecurityGroupComponent } from './vm-creation/components/security-group/vm-creation-security-group.component';
import { VmCreationFormNormalizationService } from './vm-creation/form-normalization/form-normalization.service';
import { KeyboardsComponent } from './vm-creation/keyboards/keyboards.component';
import { VmCreationService } from './vm-creation/services/vm-creation.service';
import { VmDeploymentService } from './vm-creation/services/vm-deployment.service';
import { VmTemplateDialogComponent } from './vm-creation/template/vm-template-dialog.component';
import { VmCreationTemplateComponent } from './vm-creation/template/vm-creation-template.component';
import { VmCreationDialogComponent } from './vm-creation/vm-creation-dialog.component';
import { VmCreationComponent } from './vm-creation/vm-creation.component';
import { VmFilterComponent } from './vm-filter/vm-filter.component';
import { VmListCardItemComponent } from './vm-list-item/card-item/vm-list-card-item.component';
import { VmListComponent } from './vm-list/vm-list.component';
import { AffinityGroupSelectorComponent } from './vm-sidebar/affinity-group-selector/affinity-group-selector.component';
import { VmColorComponent } from './vm-sidebar/color/vm-color.component';
import { InstanceGroupSelectorComponent } from './vm-sidebar/instance-group-selector/instance-group-selector.component';
import { InstanceGroupComponent } from './vm-sidebar/instance-group/instance-group.component';
// tslint:disable-next-line
import { FirewallRulesDetailComponent } from './vm-sidebar/network-detail/firewall-rules/firewall-rules-detail.component';
import { NetworkDetailComponent } from './vm-sidebar/network-detail/network-detail.component';
// tslint:disable-next-line
import { ServiceOfferingDetailsComponent } from './vm-sidebar/service-offering-details/service-offering-details.component';
import { SshKeypairResetComponent } from './vm-sidebar/ssh/ssh-keypair-reset.component';
import { StatisticsComponent } from './vm-sidebar/statistics/statistics.component';
import { IsoComponent } from './vm-sidebar/storage-detail/iso.component';
// tslint:disable-next-line
import { VolumeAttachmentDetailComponent } from './vm-sidebar/storage-detail/volume-attachment/volume-attachment-detail/volume-attachment-detail.component';
// tslint:disable-next-line
import { VolumeAttachmentDialogComponent } from './vm-sidebar/storage-detail/volume-attachment/volume-attchment-dialog/volume-attachment-dialog.component';
import { StorageDetailComponent } from './vm-sidebar/storage-detail/storage-detail.component';
// tslint:disable-next-line
import { SnapshotCreationComponent } from './vm-sidebar/storage-detail/volume/snapshot-creation/snapshot-creation.component';
import { SnapshotModalComponent } from './vm-sidebar/storage-detail/volume/snapshot/snapshot-modal.component';
import { SnapshotsComponent } from './vm-sidebar/storage-detail/volume/snapshot/snapshots.component';
import { VolumeDetailsComponent } from './vm-sidebar/storage-detail/volume/volume-details/volume-details.component';
import { VolumeComponent } from './vm-sidebar/storage-detail/volume/volume.component';
import { VmDetailTemplateComponent } from './vm-sidebar/template/vm-detail-template.component';
import { VmActionsSidebarComponent } from './vm-sidebar/vm-actions-sidebar/vm-actions-sidebar.component';
import { VmDetailComponent } from './vm-sidebar/vm-detail/vm-detail.component';
import { VmSidebarComponent } from './vm-sidebar/vm-sidebar.component';
import { VmDetailZoneComponent } from './vm-sidebar/zone/zone.component';
import { VmTagsComponent } from './vm-tags/vm-tags.component';
import { PostdeploymentComponent } from './vm-creation/postdeployment/postdeployment.component';

import { WebShellService } from './web-shell/web-shell.service';
// tslint:disable-next-line
import { SecurityGroupManagerExistingGroupComponent } from './vm-creation/components/security-group-rules-manager/security-group-manager-existing-group/security-group-manager-existing-group.component';
import { VmCreationSecurityGroupRulesManagerComponent } from './vm-creation/components/security-group-rules-manager/vm-creation-security-group-rules-manager.component';
import { NicComponent } from './vm-sidebar/network-detail/nics/nic/nic.component';
import { NicListComponent } from './vm-sidebar/network-detail/nics/nic-list/nic-list.component';
import { SecondaryIpComponent } from './vm-sidebar/network-detail/nics/secondary-ip/secondary-ip.component';
// tslint:disable-next-line
import { SecondaryIpListComponent } from './vm-sidebar/network-detail/nics/secondary-ip-list/secondary-ip-list.component';
import { NicFieldsComponent } from './vm-sidebar/network-detail/nics/nic/nic-fields/nic-fields.component';
import { VmResetPasswordComponent } from './vm-actions/vm-reset-password-component/vm-reset-password.component';
import { VmAccessComponent } from './vm-actions/vm-actions-component/vm-access.component';
import { VmListRowItemComponent } from './vm-list-item/row-item/vm-list-row-item.component';
import { VmTemplateDialogContainerComponent } from './vm-creation/template/containers/vm-template-dialog.container';
import { FirewallRulesDetailContainerComponent } from './vm-sidebar/network-detail/firewall-rules/firewall-rules-detail.container';


@NgModule({
  imports: [
    CommonModule,
    DynamicModule.withComponents([VmListCardItemComponent]),
    DynamicModule.withComponents([VmListRowItemComponent]),
    FormsModule,
    DraggableSelectModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatSelectModule,
    MatTabsModule,
    MatTooltipModule,
    MatButtonToggleModule,
    PulseModule,
    ReactiveFormsModule,
    RouterModule,
    ServiceOfferingModule,
    ServiceOfferingModule,
    SharedModule,
    SnapshotModule,
    TagsModule,
    TemplateModule,
    TranslateModule,
    MatProgressBarModule
  ],
  declarations: [
    AffinityGroupSelectorComponent,
    KeyboardsComponent,
    FirewallRulesDetailComponent,
    FirewallRulesDetailContainerComponent,
    NetworkDetailComponent,
    ServiceOfferingDetailsComponent,
    SnapshotsComponent,
    VolumeAttachmentDetailComponent,
    VolumeAttachmentDialogComponent,
    StatisticsComponent,
    StorageDetailComponent,
    SshKeypairResetComponent,
    VmDetailTemplateComponent,
    VmDetailZoneComponent,
    VmListComponent,
    VmActionsComponent,
    VmAccessComponent,
    VmActionsSidebarComponent,
    VmColorComponent,
    VmCreationComponent,
    VmCreationDialogComponent,
    VmListCardItemComponent,
    VmListRowItemComponent,
    VmDetailComponent,
    VmFilterComponent,
    VmSidebarComponent,
    VmCreationTemplateComponent,
    VmTemplateDialogContainerComponent,
    VmTemplateDialogComponent,
    VolumeDetailsComponent,
    InstanceGroupComponent,
    InstanceGroupSelectorComponent,
    IsoComponent,
    VmTagsComponent,
    VmDestroyDialogComponent,
    VolumeComponent,
    SnapshotCreationComponent,
    SnapshotModalComponent,
    VmCreationSecurityGroupComponent,
    SecurityGroupManagerExistingGroupComponent,
    VmCreationSecurityGroupRulesManagerComponent,
    NicComponent,
    NicListComponent,
    SecondaryIpComponent,
    SecondaryIpListComponent,
    NicFieldsComponent,
    PostdeploymentComponent,
    VmResetPasswordComponent,
  ],
  providers: [
    VmActionsService,
    VmCreationFormNormalizationService,
    VmCreationService,
    VmDeploymentService,
    VmEntityDeletionService,
    VmService,
    WebShellService,
    SnapshotActionsService,
    ...VmActionProviders,
  ],
  entryComponents: [
    AffinityGroupSelectorComponent,
    InstanceGroupSelectorComponent,
    VmCreationComponent,
    VmDestroyDialogComponent,
    VmTemplateDialogComponent,
    SnapshotCreationComponent,
    SnapshotModalComponent,
    VolumeAttachmentDialogComponent,
    SshKeypairResetComponent,
    VmCreationSecurityGroupComponent,
    PostdeploymentComponent,
    VmResetPasswordComponent,
    VmAccessComponent
  ]
})
export class VmModule {
}
