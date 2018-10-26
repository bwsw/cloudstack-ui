import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { DynamicModule } from 'ng-dynamic-component';

import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../material/material.module';
import { DraggableSelectModule } from '../shared/components/draggable-select/draggable-select.module';
import { PulseModule } from '../pulse/pulse.module';
import { ServiceOfferingModule } from '../service-offering/service-offering.module';
import { SnapshotModule } from '../snapshot/snapshot.module';
import { TagsModule } from '../tags/tags.module';
import { TemplateModule } from '../template';
// tslint:disable max-line-length
import { AccountTagsEffects } from '../reducers/account-tags/redux/account-tags.effects';
import { accountTagsReducers } from '../reducers/account-tags/redux/account-tags.reducers';
import { AccountsEffects } from '../reducers/accounts/redux/accounts.effects';
import { accountReducers } from '../reducers/accounts/redux/accounts.reducers';
import { ServiceOfferingEffects } from '../reducers/service-offerings/redux/service-offerings.effects';
import { serviceOfferingReducers } from '../reducers/service-offerings/redux/service-offerings.reducers';
import { VirtualMachineCreationEffects } from '../reducers/vm/redux/vm-creation.effects';
import { VirtualMachinesEffects } from '../reducers/vm/redux/vm.effects';
import { virtualMachineReducers } from '../reducers/vm/redux/vm.reducers';
import { ZonesEffects } from '../reducers/zones/redux/zones.effects';
import { zoneReducers } from '../reducers/zones/redux/zones.reducers';
import { NetworkDetailContainerComponent } from './container/network-detail.container';
import { ServiceOfferingDialogContainerComponent } from './container/service-offering-dialog.container';
import { StorageDetailContainerComponent } from './container/storage-detail.container';
import { VmActionsContainerComponent } from './container/vm-actions.container';
import { VmDetailContainerComponent } from './container/vm-detail.container';
import { VMFilterContainerComponent } from './container/vm-filter.container';
import { VmSidebarContainerComponent } from './container/vm-sidebar.container';
import { VmTagsContainerComponent } from './container/vm-tags.container';
import { VmVolumeDetailsContainerComponent } from './container/vm-volume-details.container';
import { VirtualMachinePageContainerComponent } from './container/vm.container';
import { VmActionsService } from './shared/vm-actions.service';
import { VmDestroyDialogComponent } from './shared/vm-destroy-dialog/vm-destroy-dialog.component';
import { VmService } from './shared/vm.service';
import { VmAccessComponent } from './vm-actions/vm-actions-component/vm-access.component';
import { VmActionsComponent } from './vm-actions/vm-actions-component/vm-actions.component';
import { VmPasswordDialogComponent } from './vm-actions/vm-reset-password-component/vm-password-dialog.component';
import { SecurityGroupManagerExistingGroupComponent } from './vm-creation/components/security-group-rules-manager/security-group-manager-existing-group/security-group-manager-existing-group.component';
import { VmCreationSecurityGroupRulesManagerComponent } from './vm-creation/components/security-group-rules-manager/vm-creation-security-group-rules-manager.component';
import { VmCreationSecurityGroupContainerComponent } from './vm-creation/components/security-group/containers/vm-creation-security-group.container';
import { VmCreationSecurityGroupComponent } from './vm-creation/components/security-group/vm-creation-security-group.component';
import { VmCreationContainerComponent } from './vm-creation/containers/vm-creation.container';
import { PostdeploymentComponent } from './vm-creation/postdeployment/postdeployment.component';
import { VmCreationServiceOfferingContainerComponent } from './vm-creation/service-offering/vm-creation-service-offering.container';
import { VmCreationSshKeySelectorComponent } from './vm-creation/ssh-key-selector/ssh-key-selector.component';
import { VmCreationAgreementComponent } from './vm-creation/template/agreement/vm-creation-agreement.component';
import { VmCreationTemplateContainerComponent } from './vm-creation/template/containers/vm-creation-template.container';
import { VmCreationTemplateComponent } from './vm-creation/template/vm-creation-template.component';
import { VmTemplateDialogComponent } from './vm-creation/template/vm-template-dialog.component';
import { VmCreationDialogComponent } from './vm-creation/vm-creation-dialog.component';
import { VmCreationComponent } from './vm-creation/vm-creation.component';
import { VmFilterComponent } from './vm-filter/vm-filter.component';
import { VmListCardItemComponent } from './vm-list-item/card-item/vm-list-card-item.component';
import { VmListRowItemComponent } from './vm-list-item/row-item/vm-list-row-item.component';
import { VmListComponent } from './vm-list/vm-list.component';
import { VmPageComponent } from './vm-page/vm-page.component';
import { AffinityGroupSelectorComponent } from './vm-sidebar/affinity-group-selector/affinity-group-selector.component';
import { AffinityGroupSelectorContainerComponent } from './vm-sidebar/affinity-group-selector/affinity-group-selector-container.component';
import { VmColorComponent } from './vm-sidebar/color/vm-color.component';
import { InstanceGroupSelectorComponent } from './vm-sidebar/instance-group-selector/instance-group-selector.component';
import { FirewallRulesDetailComponent } from './vm-sidebar/network-detail/firewall-rules/firewall-rules-detail.component';
import { FirewallRulesDetailContainerComponent } from './vm-sidebar/network-detail/firewall-rules/firewall-rules-detail.container';
import { NicListComponent } from './vm-sidebar/network-detail/nics/nic-list/nic-list.component';
import { NicFieldsComponent } from './vm-sidebar/network-detail/nics/nic/nic-fields/nic-fields.component';
import { NicComponent } from './vm-sidebar/network-detail/nics/nic/nic.component';
import { SecondaryIpListComponent } from './vm-sidebar/network-detail/nics/secondary-ip-list/secondary-ip-list.component';
import { SecondaryIpComponent } from './vm-sidebar/network-detail/nics/secondary-ip/secondary-ip.component';
import { SshKeypairResetComponent } from './vm-sidebar/ssh-selector/ssh-keypair-reset.component';
import { StatisticsComponent } from './vm-sidebar/statistics/statistics.component';
import { IsoComponent } from './vm-sidebar/storage-detail/iso/iso.component';
import { VolumeAttachmentDetailComponent } from './vm-sidebar/storage-detail/volume-attachment/volume-attachment-detail/volume-attachment-detail.component';
import { VolumeAttachmentDialogComponent } from './vm-sidebar/storage-detail/volume-attachment/volume-attchment-dialog/volume-attachment-dialog.component';
import { SnapshotCreationComponent } from './vm-sidebar/storage-detail/volumes/snapshot-creation/snapshot-creation.component';
import { SnapshotModalComponent } from './vm-sidebar/storage-detail/volumes/snapshot/snapshot-modal.component';
import { SnapshotModalContainerComponent } from './vm-sidebar/storage-detail/volumes/snapshot/snapshot-modal.container';
import { SnapshotsComponent } from './vm-sidebar/storage-detail/volumes/snapshot/snapshots.component';
import { SnapshotsContainerComponent } from './vm-sidebar/storage-detail/volumes/snapshot/snapshots.container';
import { VolumeDetailsComponent } from './vm-sidebar/storage-detail/volumes/volume-details/volume-details.component';
import { VolumeComponent } from './vm-sidebar/storage-detail/volumes/volume/volume.component';
import { VolumesComponent } from './vm-sidebar/storage-detail/volumes/volumes.component';
import { AffinityGroupComponent } from './vm-sidebar/vm-detail/affinity-group/affinity-group.component';
import { InstanceGroupComponent } from './vm-sidebar/vm-detail/instance-group/instance-group.component';
import { ServiceOfferingDetailsComponent } from './vm-sidebar/vm-detail/service-offering-details/service-offering-details.component';
import { SshKeypairComponent } from './vm-sidebar/vm-detail/ssh/ssh-keypair.component';
import { VmDetailTemplateComponent } from './vm-sidebar/vm-detail/template/vm-detail-template.component';
import { VmDetailZoneComponent } from './vm-sidebar/vm-detail/zone/zone.component';
import { VmSidebarComponent } from './vm-sidebar/vm-sidebar.component';
import { VmTagsComponent } from './vm-sidebar/vm-tags/vm-tags.component';
import { ServiceOfferingSelectorComponent } from './vm-creation/components/service-offering-selector/service-offering-selector.component';
import { InstallationSourceDialogComponent } from './vm-creation/template/containers/installation-source-dialog.component';
import { VmPasswordComponent } from './shared/vm-password/vm-password.component';
import { HttpAccessService, SshAccessService, VncAccessService } from './services';
import {
  VmDetailsAffinityGroupListComponent,
  VmCreationAffinityGroupListComponent,
} from './vm-sidebar/affinity-group-selector';
import { VmCreationAffinityGroupManagerComponent } from './vm-creation/components/affinity-group-manager/vm-creation-affinity-group-manager.component';

// tslint:enable max-line-length

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MaterialModule,
    DynamicModule.withComponents([VmListCardItemComponent]),
    DynamicModule.withComponents([VmListRowItemComponent]),
    DraggableSelectModule,
    PulseModule,
    RouterModule,
    ServiceOfferingModule,
    SnapshotModule,
    TagsModule,
    TemplateModule,
    TranslateModule,
    StoreModule.forFeature('virtualMachines', virtualMachineReducers),
    StoreModule.forFeature('accounts', accountReducers),
    StoreModule.forFeature('tags', accountTagsReducers),
    StoreModule.forFeature('zones', zoneReducers),
    StoreModule.forFeature('service-offerings', serviceOfferingReducers),
    EffectsModule.forFeature([
      VirtualMachinesEffects,
      VirtualMachineCreationEffects,
      ZonesEffects,
      AccountsEffects,
      AccountTagsEffects,
      ServiceOfferingEffects,
    ]),
  ],
  declarations: [
    AffinityGroupComponent,
    AffinityGroupSelectorComponent,
    AffinityGroupSelectorContainerComponent,
    VmDetailsAffinityGroupListComponent,
    VmCreationAffinityGroupListComponent,
    FirewallRulesDetailComponent,
    FirewallRulesDetailContainerComponent,
    NetworkDetailContainerComponent,
    ServiceOfferingDetailsComponent,
    ServiceOfferingDialogContainerComponent,
    SnapshotsComponent,
    SnapshotsContainerComponent,
    VolumeAttachmentDetailComponent,
    VolumeAttachmentDialogComponent,
    StatisticsComponent,
    StorageDetailContainerComponent,
    SshKeypairComponent,
    SshKeypairResetComponent,
    VmDetailTemplateComponent,
    VmDetailZoneComponent,
    VirtualMachinePageContainerComponent,
    VmPageComponent,
    VmListComponent,
    VmActionsComponent,
    VmActionsContainerComponent,
    VmAccessComponent,
    VmColorComponent,
    VmCreationContainerComponent,
    VmCreationComponent,
    VmCreationDialogComponent,
    VmCreationAgreementComponent,
    VmListCardItemComponent,
    VmListRowItemComponent,
    VmDetailContainerComponent,
    VMFilterContainerComponent,
    VmFilterComponent,
    VmSidebarContainerComponent,
    VmSidebarComponent,
    VmCreationTemplateContainerComponent,
    VmCreationTemplateComponent,
    VmCreationServiceOfferingContainerComponent,
    VmCreationSshKeySelectorComponent,
    VmTemplateDialogComponent,
    VmVolumeDetailsContainerComponent,
    VolumeDetailsComponent,
    InstanceGroupComponent,
    InstanceGroupSelectorComponent,
    IsoComponent,
    VmTagsContainerComponent,
    VmTagsComponent,
    VmDestroyDialogComponent,
    VolumesComponent,
    VolumeComponent,
    SnapshotCreationComponent,
    SnapshotModalComponent,
    SnapshotModalContainerComponent,
    VmCreationSecurityGroupContainerComponent,
    VmCreationSecurityGroupComponent,
    VmCreationSecurityGroupContainerComponent,
    SecurityGroupManagerExistingGroupComponent,
    VmCreationSecurityGroupRulesManagerComponent,
    VmCreationAffinityGroupManagerComponent,
    NicComponent,
    NicListComponent,
    SecondaryIpComponent,
    SecondaryIpListComponent,
    NicFieldsComponent,
    PostdeploymentComponent,
    VmPasswordDialogComponent,
    ServiceOfferingSelectorComponent,
    InstallationSourceDialogComponent,
    VmPasswordComponent,
  ],
  providers: [VmActionsService, VmService, SshAccessService, HttpAccessService, VncAccessService],
  entryComponents: [
    AffinityGroupSelectorContainerComponent,
    VmDetailsAffinityGroupListComponent,
    VmCreationAffinityGroupListComponent,
    InstanceGroupSelectorComponent,
    VmCreationContainerComponent,
    VmDestroyDialogComponent,
    InstallationSourceDialogComponent,
    VmCreationAgreementComponent,
    SnapshotCreationComponent,
    SnapshotModalContainerComponent,
    VolumeAttachmentDialogComponent,
    SshKeypairResetComponent,
    VmCreationSecurityGroupContainerComponent,
    VmCreationServiceOfferingContainerComponent,
    PostdeploymentComponent,
    VmPasswordDialogComponent,
    VmAccessComponent,
    ServiceOfferingDialogContainerComponent,
  ],
})
export class VmModule {}
