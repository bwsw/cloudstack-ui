import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
// tslint:disable-next-line
import { VmCreationSecurityGroupComponent } from './vm-creation/components/security-group/vm-creation-security-group.component';
import { KeyboardsComponent } from './vm-creation/keyboards/keyboards.component';
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
import { InstanceGroupComponent } from './vm-sidebar/vm-detail/instance-group/instance-group.component';
// tslint:disable-next-line
import { FirewallRulesDetailComponent } from './vm-sidebar/network-detail/firewall-rules/firewall-rules-detail.component';
// tslint:disable-next-line
import { ServiceOfferingDetailsComponent } from './vm-sidebar/vm-detail/service-offering-details/service-offering-details.component';
import { SshKeypairResetComponent } from './vm-sidebar/ssh-selector/ssh-keypair-reset.component';
import { StatisticsComponent } from './vm-sidebar/statistics/statistics.component';
import { IsoComponent } from './vm-sidebar/storage-detail/iso/iso.component';
// tslint:disable-next-line
import { VolumeAttachmentDetailComponent } from './vm-sidebar/storage-detail/volume-attachment/volume-attachment-detail/volume-attachment-detail.component';
// tslint:disable-next-line
import { VolumeAttachmentDialogComponent } from './vm-sidebar/storage-detail/volume-attachment/volume-attchment-dialog/volume-attachment-dialog.component';
// tslint:disable-next-line
import { SnapshotCreationComponent } from './vm-sidebar/storage-detail/volumes/snapshot-creation/snapshot-creation.component';
import { SnapshotModalComponent } from './vm-sidebar/storage-detail/volumes/snapshot/snapshot-modal.component';
import { SnapshotsComponent } from './vm-sidebar/storage-detail/volumes/snapshot/snapshots.component';
import { VolumeDetailsComponent } from './vm-sidebar/storage-detail/volumes/volume-details/volume-details.component';
import { VolumeComponent } from './vm-sidebar/storage-detail/volumes/volume/volume.component';
import { VmDetailTemplateComponent } from './vm-sidebar/vm-detail/template/vm-detail-template.component';
import { VmSidebarComponent } from './vm-sidebar/vm-sidebar.component';
import { VmDetailZoneComponent } from './vm-sidebar/vm-detail/zone/zone.component';
import { VmTagsComponent } from './vm-sidebar/vm-tags/vm-tags.component';
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
import { VirtualMachinePageContainerComponent } from './container/vm.container';
import { VmPageComponent } from './vm-page/vm-page.component';
import { VMFilterContainerComponent } from './container/vm-filter.container';
import { StoreModule } from '@ngrx/store';
import { virtualMachineReducers } from '../reducers/vm/redux/vm.reducers';
import { accountReducers } from '../reducers/accounts/redux/accounts.reducers';
import { zoneReducers } from '../reducers/zones/redux/zones.reducers';
import { AccountsEffects } from '../reducers/accounts/redux/accounts.effects';
import { ZonesEffects } from '../reducers/zones/redux/zones.effects';
import { VirtualMachinesEffects } from '../reducers/vm/redux/vm.effects';
import { EffectsModule } from '@ngrx/effects';
import { VmSidebarContainerComponent } from './container/vm-sidebar.container';
import { AffinityGroupComponent } from './vm-sidebar/vm-detail/affinity-group/affinity-group.component';
import { SshKeypairComponent } from './vm-sidebar/vm-detail/ssh/ssh-keypair.component';
import { VmDetailContainerComponent } from './container/vm-detail.container';
import { serviceOfferingReducers } from '../reducers/service-offerings/redux/service-offerings.reducers';
import { ServiceOfferingEffects } from '../reducers/service-offerings/redux/service-offerings.effects';
import { VolumesComponent } from './vm-sidebar/storage-detail/volumes/volumes.component';
import { StorageDetailContainerComponent } from './container/storage-detail.container';
import { VmVolumeDetailsContainerComponent } from './container/vm-volume-details.container';
import { NetworkDetailContainerComponent } from './container/network-detail.container';
import { VmTagsContainerComponent } from './container/vm-tags.container';
import { VmActionsContainerComponent } from './container/vm-actions.container';
import { ServiceOfferingDialogContainerComponent } from './container/service-offering-dialog.container';
// tslint:disable-next-line
import { FirewallRulesDetailContainerComponent } from './vm-sidebar/network-detail/firewall-rules/firewall-rules-detail.container';
import { SnapshotModalContainerComponent } from './vm-sidebar/storage-detail/volumes/snapshot/snapshot-modal.container';
import { SnapshotsContainerComponent } from './vm-sidebar/storage-detail/volumes/snapshot/snapshots.container';
import { VmCreationAgreementComponent } from './vm-creation/template/agreement/vm-creation-agreement.component';
import { HttpModule } from '@angular/http';
import { VmCreationContainerComponent } from './vm-creation/containers/vm-creation.container';
import { VmCreationTemplateContainerComponent } from './vm-creation/template/containers/vm-creation-template.container';
import { DiskOfferingContainerComponent } from './vm-creation/containers/disk-offering.container';
// tslint:disable-next-line
import { VmCreationSshKeySelectorContainerComponent } from './vm-creation/ssh-key-selector/containers/ssh-key-selector.container';
import { VmCreationSshKeySelectorComponent } from './vm-creation/ssh-key-selector/ssh-key-selector.component';
// tslint:disable-next-line
import { VmCreationSecurityGroupContainerComponent } from './vm-creation/components/security-group/containers/vm-creation-security-group.container';

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
    SharedModule,
    SnapshotModule,
    TagsModule,
    TemplateModule,
    TranslateModule,
    MatProgressBarModule,
    HttpModule,
    StoreModule.forFeature('virtualMachines', virtualMachineReducers),
    StoreModule.forFeature('accounts', accountReducers),
    StoreModule.forFeature('zones', zoneReducers),
    StoreModule.forFeature('service-offerings', serviceOfferingReducers),
    EffectsModule.forFeature([
      VirtualMachinesEffects,
      ZonesEffects,
      AccountsEffects,
      ServiceOfferingEffects
    ]),
  ],
  declarations: [
    AffinityGroupComponent,
    AffinityGroupSelectorComponent,
    DiskOfferingContainerComponent,
    KeyboardsComponent,
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
    VmCreationSshKeySelectorContainerComponent,
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
    VmDeploymentService,
    VmEntityDeletionService,
    VmService,
    WebShellService,
    SnapshotActionsService,
  ],
  entryComponents: [
    AffinityGroupSelectorComponent,
    InstanceGroupSelectorComponent,
    VmCreationContainerComponent,
    VmDestroyDialogComponent,
    VmTemplateDialogComponent,
    VmCreationAgreementComponent,
    SnapshotCreationComponent,
    SnapshotModalContainerComponent,
    VolumeAttachmentDialogComponent,
    SshKeypairResetComponent,
    VmCreationSecurityGroupContainerComponent,
    PostdeploymentComponent,
    VmResetPasswordComponent,
    VmAccessComponent,
    ServiceOfferingDialogContainerComponent
  ]
})
export class VmModule {
}
