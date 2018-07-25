import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { State, UserTagsSelectors } from '../../../root-store';
import {
  AccountResourceType,
  AffinityGroup,
  DiskOffering,
  InstanceGroup,
  ServiceOffering,
  SSHKeyPair,
  Zone
} from '../../../shared/models';
import { AuthService } from '../../../shared/services/auth.service';
import { BaseTemplateModel } from '../../../template/shared';
import { VmService } from '../../shared/vm.service';
import { NotSelected, VmCreationState } from '../data/vm-creation-state';
import { KeyboardLayout } from '../keyboards/keyboards.component';
import { VmCreationSecurityGroupData } from '../security-group/vm-creation-security-group-data';

import * as accountTagsActions from '../../../reducers/account-tags/redux/account-tags.actions';
import * as affinityGroupActions from '../../../reducers/affinity-groups/redux/affinity-groups.actions';
import * as fromAffinityGroups from '../../../reducers/affinity-groups/redux/affinity-groups.reducers';
import * as fromAuth from '../../../reducers/auth/redux/auth.reducers';
import * as diskOfferingActions from '../../../reducers/disk-offerings/redux/disk-offerings.actions';
import * as fromDiskOfferings from '../../../reducers/disk-offerings/redux/disk-offerings.reducers';
import * as securityGroupActions from '../../../reducers/security-groups/redux/sg.actions';
import * as soClassActions from '../../../reducers/service-offerings/redux/service-offering-class.actions';
import * as serviceOfferingActions from '../../../reducers/service-offerings/redux/service-offerings.actions';
import * as fromServiceOfferings from '../../../reducers/service-offerings/redux/service-offerings.reducers';
import * as sshKeyActions from '../../../reducers/ssh-keys/redux/ssh-key.actions';
import * as fromSshKeys from '../../../reducers/ssh-keys/redux/ssh-key.reducers';
import * as templateActions from '../../../reducers/templates/redux/template.actions';
import * as fromTemplates from '../../../reducers/templates/redux/template.reducers';
import * as vmActions from '../../../reducers/vm/redux/vm.actions';
import * as fromVMs from '../../../reducers/vm/redux/vm.reducers';
import * as zoneActions from '../../../reducers/zones/redux/zones.actions';
import * as fromZones from '../../../reducers/zones/redux/zones.reducers';

@Component({
  selector: 'cs-vm-creation-container',
  template: `
    <cs-vm-creation
      [account]="account$ | async"
      [vmCreationState]="vmFormState$ | async"
      [fetching]="isLoading$ | async"
      [instanceGroupList]="instanceGroups$ | async"
      [affinityGroupList]="affinityGroups$ | async"
      [diskOfferings]="diskOfferings$ | async"
      [diskOfferingsAreLoading]="diskOfferingsAreLoading$ | async"
      [zones]="zones$ | async"
      [showOverlay]="showOverlay$ | async"
      [deploymentInProgress]="deploymentInProgress$ | async"
      [deployedVm]="deployedVm$ | async"
      [enoughResources]="enoughResources$ | async"
      [insufficientResources]="insufficientResources$ | async"
      [loggerStageList]="loggerStageList$ | async"
      [serviceOfferings]="serviceOfferings$ | async"
      [customOfferingRestrictions]="customOfferingRestrictions$ | async"
      [sshKeyPairs]="sshKeyPairs$ | async"
      [diskOfferingParams]="diskOfferingParams$ | async"
      (displayNameChange)="onDisplayNameChange($event)"
      (templateChange)="onTemplateChange($event)"
      (serviceOfferingChange)="onServiceOfferingChange($event)"
      (diskOfferingChange)="onDiskOfferingChange($event)"
      (rootDiskSizeChange)="onRootDiskSizeChange($event)"
      (rootDiskSizeMinChange)="onRootDiskSizeMinChange($event)"
      (securityRulesChange)="onSecurityRulesChange($event)"
      (keyboardChange)="onKeyboardChange($event)"
      (affinityGroupChange)="onAffinityGroupChange($event)"
      (instanceGroupChange)="onInstanceGroupChange($event)"
      (onSshKeyPairChange)="onSshKeyPairChange($event)"
      (zoneChange)="onZoneChange($event)"
      (doStartVmChange)="onDoStartVmChange($event)"
      (agreementChange)="onAgreementChange($event)"
      (cancel)="onCancel()"
      (deploy)="onDeploy($event)"
      (onVmDeploymentFailed)="showOverlayChange()"
    ></cs-vm-creation>
  `
})
export class VmCreationContainerComponent implements OnInit {
  readonly vmFormState$ = this.store.select(fromVMs.getVmFormState);
  readonly isLoading$ = this.store.select(fromVMs.formIsLoading)
    .withLatestFrom(
      this.store.select(fromZones.isLoading),
      this.store.select(fromServiceOfferings.isLoading),
      this.store.select(fromAuth.isLoading),
      this.store.select(fromTemplates.isLoading),
      this.store.select(fromAffinityGroups.isLoading)
    )
    .map((loadings: boolean[]) => loadings.find(loading => loading));
  readonly serviceOfferings$ = this.store.select(fromServiceOfferings.getAvailableOfferingsForVmCreation);
  readonly customOfferingRestrictions$ = this.store.select(fromServiceOfferings.getCustomRestrictionsForVmCreation);
  readonly showOverlay$ = this.store.select(fromVMs.showOverlay);
  readonly deploymentInProgress$ = this.store.select(fromVMs.deploymentInProgress);
  readonly diskOfferings$ = this.store.select(fromDiskOfferings.selectAll);
  readonly diskOfferingsAreLoading$ = this.store.select(fromDiskOfferings.isLoading);
  readonly deployedVm$ = this.store.select(fromVMs.getDeployedVM);
  readonly enoughResources$ = this.store.select(fromVMs.enoughResources);
  readonly insufficientResources$ = this.store.select(fromVMs.insufficientResources);
  readonly loggerStageList$ = this.store.select(fromVMs.loggerStageList);
  readonly instanceGroups$ = this.store.select(fromVMs.selectVmGroups);
  readonly affinityGroups$ = this.store.select(fromAffinityGroups.selectAll);
  readonly account$ = this.store.select(fromAuth.getUserAccount);
  readonly zones$ = this.store.select(fromZones.selectAll);
  readonly sshKeyPairs$ = this.store.select(fromSshKeys.selectSshKeysForAccount);
  readonly diskOfferingParams$ = this.store.select(fromDiskOfferings.getParams);

  constructor(
    private store: Store<State>,
    private virtualMachineService: VmService,
    private authService: AuthService,
    private dialogRef: MatDialogRef<VmCreationContainerComponent>
  ) {
    this.store.dispatch(new securityGroupActions.LoadSecurityGroupRequest());
    this.store.dispatch(new zoneActions.LoadZonesRequest());
    this.store.dispatch(new templateActions.LoadTemplatesRequest());
    this.store.dispatch(new sshKeyActions.LoadSshKeyRequest());
    this.store.dispatch(new diskOfferingActions.LoadOfferingsRequest());
    this.store.dispatch(new affinityGroupActions.LoadAffinityGroupsRequest());
    this.store.dispatch(new serviceOfferingActions.LoadOfferingsRequest());
    this.store.dispatch(new serviceOfferingActions.LoadCustomRestrictionsRequest());
    this.store.dispatch(new serviceOfferingActions.LoadDefaultParamsRequest());
    this.store.dispatch(new serviceOfferingActions.LoadOfferingAvailabilityRequest());
    this.store.dispatch(new soClassActions.LoadServiceOfferingClassRequest());
    this.store.dispatch(new accountTagsActions.LoadAccountTagsRequest({ resourcetype: AccountResourceType }));
    this.store.dispatch(new diskOfferingActions.LoadDefaultParamsRequest());

    this.getDefaultVmName()
      .subscribe(displayName => this.onDisplayNameChange(displayName));

    this.dialogRef.afterClosed().subscribe(() => this.onCancel());
  }

  public ngOnInit() {
    this.store.dispatch(new vmActions.VmCreationFormInit());
  }

  public onDisplayNameChange(displayName: string) {
    this.store.dispatch(new vmActions.VmFormUpdate({ displayName }));
  }

  public onServiceOfferingChange(serviceOffering: ServiceOffering) {
    this.store.dispatch(new vmActions.VmFormUpdate({ serviceOffering }));
  }

  public onDiskOfferingChange(diskOffering: DiskOffering) {
    this.store.dispatch(new vmActions.VmFormUpdate({ diskOffering }));
  }

  public onRootDiskSizeChange(rootDiskSize: number) {
    this.store.dispatch(new vmActions.VmFormUpdate({ rootDiskSize }));
  }

  public onRootDiskSizeMinChange(rootDiskMinSize: number) {
    this.store.dispatch(new vmActions.VmFormUpdate({ rootDiskMinSize }));
  }

  public onTemplateChange(template: BaseTemplateModel) {
    this.store.dispatch(new vmActions.VmFormUpdate({ template }));
  }

  public onInstanceGroupChange(instanceGroup: InstanceGroup) {
    this.store.dispatch(new vmActions.VmFormUpdate({ instanceGroup }));
  }

  public onAffinityGroupChange(affinityGroup: AffinityGroup) {
    this.store.dispatch(new vmActions.VmFormUpdate({ affinityGroup }));
  }

  public onKeyboardChange(keyboard: KeyboardLayout) {
    this.store.dispatch(new vmActions.VmFormUpdate({ keyboard }));
  }

  public onZoneChange(zone: Zone) {
    this.store.dispatch(new vmActions.VmFormUpdate({ zone }));
  }

  public onSecurityRulesChange(securityGroupData: VmCreationSecurityGroupData) {
    this.store.dispatch(new vmActions.VmFormUpdate({ securityGroupData }));
  }

  public onSshKeyPairChange(sshKeyPair: SSHKeyPair | NotSelected) {
    this.store.dispatch(new vmActions.VmFormUpdate({ sshKeyPair }));
  }

  public onDoStartVmChange(doStartVm: boolean) {
    this.store.dispatch(new vmActions.VmFormUpdate({ doStartVm }));
  }

  public onAgreementChange(agreement: boolean) {
    this.store.dispatch(new vmActions.VmFormUpdate({ agreement }));
  }

  public onDeploy(state: VmCreationState) {
    this.store.dispatch(new vmActions.DeployVm(state));
  }

  public onCancel() {
    this.store.dispatch(new vmActions.VmCreationFormClean());
  }

  public showOverlayChange() {
    this.store.dispatch(new vmActions.VmCreationStateUpdate({ showOverlay: false }));
  }

  private getDefaultVmName(): Observable<string> {
    return this.store.select(UserTagsSelectors.getLastVMId)
      .first()
      .map(numberOfVms => `vm-${this.authService.user.username}-${numberOfVms + 1}`);
  }
}
