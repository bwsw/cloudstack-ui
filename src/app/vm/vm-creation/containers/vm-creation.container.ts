import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { select, Store } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  accountResourceType,
  AffinityGroup,
  DiskOffering,
  InstanceGroup,
  SSHKeyPair,
  Zone,
} from '../../../shared/models';
import { AuthService } from '../../../shared/services/auth.service';
import { BaseTemplateModel } from '../../../template/shared';
import { NotSelected, VmCreationState } from '../data/vm-creation-state';
import { VmCreationSecurityGroupData } from '../security-group/vm-creation-security-group-data';

import { State, UserTagsSelectors } from '../../../root-store';
import * as accountTagsActions from '../../../reducers/account-tags/redux/account-tags.actions';
import * as affinityGroupActions from '../../../reducers/affinity-groups/redux/affinity-groups.actions';
import * as fromAffinityGroups from '../../../reducers/affinity-groups/redux/affinity-groups.reducers';
import * as fromAuth from '../../../reducers/auth/redux/auth.reducers';
import * as diskOfferingActions from '../../../reducers/disk-offerings/redux/disk-offerings.actions';
import * as fromDiskOfferings from '../../../reducers/disk-offerings/redux/disk-offerings.reducers';
import * as securityGroupActions from '../../../reducers/security-groups/redux/sg.actions';
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
import { getAvailableOfferingsForVmCreation } from '../../selectors';
import { ComputeOfferingViewModel } from '../../view-models';

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
      [sshKeyPairs]="sshKeyPairs$ | async"
      (displayNameChange)="onDisplayNameChange($event)"
      (templateChange)="onTemplateChange($event)"
      (serviceOfferingChange)="onServiceOfferingChange($event)"
      (diskOfferingChange)="onDiskOfferingChange($event)"
      (rootDiskSizeChange)="onRootDiskSizeChange($event)"
      (rootDiskSizeMinChange)="onRootDiskSizeMinChange($event)"
      (securityRulesChange)="onSecurityRulesChange($event)"
      (affinityGroupChange)="onAffinityGroupChange($event)"
      (instanceGroupChange)="onInstanceGroupChange($event)"
      (sshKeyPairChanged)="onSshKeyPairChange($event)"
      (zoneChange)="onZoneChange($event)"
      (doStartVmChange)="onDoStartVmChange($event)"
      (agreementChange)="onAgreementChange($event)"
      (cancel)="onCancel()"
      (deploy)="onDeploy($event)"
      (vmDeploymentFailed)="showOverlayChange()"
    ></cs-vm-creation>
  `,
})
export class VmCreationContainerComponent implements OnInit {
  readonly vmFormState$ = this.store.pipe(select(fromVMs.getVmFormState));
  readonly isLoading$ = combineLatest(
    this.store.pipe(select(fromVMs.formIsLoading)),
    this.store.pipe(select(fromZones.isLoading)),
    this.store.pipe(select(fromServiceOfferings.isLoading)),
    this.store.pipe(select(fromAuth.isLoading)),
    this.store.pipe(select(fromTemplates.isLoading)),
    this.store.pipe(select(fromAffinityGroups.isLoading)),
    this.store.pipe(select(UserTagsSelectors.getIsLoading)),
  ).pipe(map((loadings: boolean[]) => !!loadings.find(loading => loading)));
  readonly serviceOfferings$ = this.store.pipe(select(getAvailableOfferingsForVmCreation));
  readonly showOverlay$ = this.store.pipe(select(fromVMs.showOverlay));
  readonly deploymentInProgress$ = this.store.pipe(select(fromVMs.deploymentInProgress));
  readonly diskOfferings$ = this.store.pipe(select(fromDiskOfferings.selectAll));
  readonly diskOfferingsAreLoading$ = this.store.pipe(select(fromDiskOfferings.isLoading));
  readonly deployedVm$ = this.store.pipe(select(fromVMs.getDeployedVM));
  readonly enoughResources$ = this.store.pipe(select(fromVMs.enoughResources));
  readonly insufficientResources$ = this.store.pipe(select(fromVMs.insufficientResources));
  readonly loggerStageList$ = this.store.pipe(select(fromVMs.loggerStageList));
  readonly instanceGroups$ = this.store.pipe(select(fromVMs.selectVmGroups));
  readonly affinityGroups$ = this.store.pipe(select(fromAffinityGroups.selectAll));
  readonly account$ = this.store.pipe(select(fromAuth.getUserAccount));
  readonly zones$ = this.store.pipe(select(fromZones.selectAll));
  readonly sshKeyPairs$ = this.store.pipe(select(fromSshKeys.selectSshKeysForAccount));

  constructor(
    private store: Store<State>,
    private authService: AuthService,
    private dialogRef: MatDialogRef<VmCreationContainerComponent>,
  ) {
    this.store.dispatch(new securityGroupActions.LoadSecurityGroupRequest());
    this.store.dispatch(new zoneActions.LoadZonesRequest());
    this.store.dispatch(new templateActions.LoadTemplatesRequest());
    this.store.dispatch(new sshKeyActions.LoadSshKeyRequest());
    this.store.dispatch(new diskOfferingActions.LoadOfferingsRequest());
    this.store.dispatch(new affinityGroupActions.LoadAffinityGroupsRequest());
    this.store.dispatch(new serviceOfferingActions.LoadOfferingsRequest());
    this.store.dispatch(
      new accountTagsActions.LoadAccountTagsRequest({ resourcetype: accountResourceType }),
    );

    this.getDefaultVmName().subscribe(displayName => this.onDisplayNameChange(displayName));

    this.dialogRef.afterClosed().subscribe(() => this.onCancel());
  }

  public ngOnInit() {
    this.store.dispatch(new vmActions.VmCreationFormInit());
  }

  public onDisplayNameChange(displayName: string) {
    this.store.dispatch(new vmActions.VmFormUpdate({ displayName }));
  }

  public onServiceOfferingChange(serviceOffering: ComputeOfferingViewModel) {
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
    return this.store.pipe(
      select(UserTagsSelectors.getLastVMId),
      map(numberOfVms => `vm-${this.authService.user.username}-${numberOfVms + 1}`),
    );
  }
}
