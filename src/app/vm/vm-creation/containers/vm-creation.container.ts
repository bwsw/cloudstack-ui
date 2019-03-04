import { Component, OnDestroy } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { select, Store } from '@ngrx/store';
import { combineLatest } from 'rxjs';
import { filter, map, take, tap } from 'rxjs/operators';

import {
  accountResourceType,
  AffinityGroup,
  DiskOffering,
  SSHKeyPair,
  Zone,
} from '../../../shared/models';
import { BaseTemplateModel } from '../../../template/shared';
import { NotSelected, VmCreationState } from '../data/vm-creation-state';
import { VmCreationSecurityGroupData } from '../security-group/vm-creation-security-group-data';

import { capabilitiesSelectors, State, UserTagsSelectors } from '../../../root-store';
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
import * as fromTemplates from '../../../reducers/templates/redux/template.reducers';
import * as vmActions from '../../../reducers/vm/redux/vm.actions';
import * as fromVMs from '../../../reducers/vm/redux/vm.reducers';
import * as zoneActions from '../../../reducers/zones/redux/zones.actions';
import * as fromZones from '../../../reducers/zones/redux/zones.reducers';
import { getAvailableOfferingsForVmCreation } from '../../selectors';
import { ComputeOfferingViewModel } from '../../view-models';
import * as fromAccounts from '../../../reducers/accounts/redux/accounts.reducers';
import * as fromAccountTags from '../../../reducers/account-tags/redux/account-tags.reducers';

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
      [virtualMachineList]="vms$ | async"
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
      [isDiskOfferingAvailableByResources]="isDiskOfferingAvailableByResources$ | async"
      [isSecurityGroupEnabled]="isSecurityGroupEnabled$ | async"
      [minSize]="minSize$ | async"
      [isError]="isError$ | async"
      [maxRootSize]="maxRootSize$ | async"
      (displayNameChange)="onDisplayNameChange($event)"
      (hostNameChange)="onHostNameChange($event)"
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
      (userDataChanged)="onUserDataChanged($event)"
      (cancel)="onCancel()"
      (deploy)="onDeploy($event)"
      (vmDeploymentFailed)="showOverlayChange()"
    ></cs-vm-creation>
  `,
})
export class VmCreationContainerComponent implements OnDestroy {
  readonly isDataLoaded$ = combineLatest(
    this.store.pipe(select(fromZones.isLoaded)),
    this.store.pipe(select(fromServiceOfferings.isLoaded)),
    this.store.pipe(select(fromAuth.isLoaded)),
    this.store.pipe(select(fromTemplates.isLoaded)),
    this.store.pipe(select(fromAffinityGroups.isLoaded)),
    this.store.pipe(select(fromAccounts.isLoaded)),
    this.store.pipe(select(UserTagsSelectors.getIsLoaded)),
    this.store.pipe(select(fromAccountTags.isLoaded)),
  ).pipe(map(loadings => loadings.every(Boolean)));

  readonly isLoading$ = combineLatest(
    this.store.pipe(select(fromVMs.formIsLoaded)),
    this.isDataLoaded$,
  ).pipe(map(loadings => !loadings.every(Boolean)));

  readonly formInitSubscription = this.isDataLoaded$
    .pipe(
      filter(Boolean),
      take(1),
      tap(() => this.store.dispatch(new vmActions.VmCreationFormInit())),
    )
    .subscribe();

  readonly isError$ = this.store.pipe(select(fromVMs.isError));
  readonly vmFormState$ = this.store.pipe(select(fromVMs.getVmFormState));
  readonly serviceOfferings$ = this.store.pipe(select(getAvailableOfferingsForVmCreation));
  readonly showOverlay$ = this.store.pipe(select(fromVMs.showOverlay));
  readonly vms$ = this.store.pipe(select(fromVMs.selectAll));
  readonly deploymentInProgress$ = this.store.pipe(select(fromVMs.deploymentInProgress));
  readonly diskOfferings$ = this.store.pipe(select(fromDiskOfferings.selectAll));
  readonly diskOfferingsAreLoading$ = this.store.pipe(select(fromDiskOfferings.isLoading));
  readonly deployedVm$ = this.store.pipe(select(fromVMs.getDeployedVM));
  readonly enoughResources$ = this.store.pipe(select(fromVMs.enoughResources));
  readonly insufficientResources$ = this.store.pipe(select(fromVMs.insufficientResources));
  readonly loggerStageList$ = this.store.pipe(select(fromVMs.loggerStageList));
  readonly instanceGroups$ = this.store.pipe(select(fromVMs.selectVmGroups));
  readonly affinityGroups$ = this.store.pipe(select(fromAffinityGroups.selectAll));
  readonly account$ = this.store.pipe(select(fromAccounts.selectUserAccount));
  readonly zones$ = this.store.pipe(select(fromZones.selectAll));
  readonly sshKeyPairs$ = this.store.pipe(select(fromSshKeys.selectSshKeysForAccount));
  readonly minSize$ = this.store.pipe(select(capabilitiesSelectors.getCustomDiskOfferingMinSize));
  readonly maxRootSize$ = this.store.pipe(
    select(capabilitiesSelectors.getCustomDiskOfferingMaxSize),
  );
  readonly isDiskOfferingAvailableByResources$ = this.store.pipe(
    select(fromDiskOfferings.isVmCreationDiskOfferingAvailableByResources),
  );
  readonly isSecurityGroupEnabled$ = this.store.pipe(
    select(capabilitiesSelectors.getIsSecurityGroupEnabled),
  );

  constructor(
    private store: Store<State>,
    private dialogRef: MatDialogRef<VmCreationContainerComponent>,
  ) {
    this.store.dispatch(new securityGroupActions.LoadSecurityGroupRequest());
    this.store.dispatch(new zoneActions.LoadZonesRequest());
    this.store.dispatch(new sshKeyActions.LoadSshKeyRequest());
    this.store.dispatch(new diskOfferingActions.LoadOfferingsRequest());
    this.store.dispatch(new affinityGroupActions.LoadAffinityGroupsRequest());
    this.store.dispatch(new serviceOfferingActions.LoadOfferingsRequest());
    this.store.dispatch(
      new accountTagsActions.LoadAccountTagsRequest({ resourcetype: accountResourceType }),
    );

    this.dialogRef.afterClosed().subscribe(() => this.onCancel());
  }

  public ngOnDestroy(): void {
    this.formInitSubscription.unsubscribe();
  }

  public onDisplayNameChange(displayName: string) {
    this.store.dispatch(new vmActions.VmFormUpdate({ displayName }));
  }

  public onHostNameChange(name: string) {
    this.store.dispatch(new vmActions.VmFormUpdate({ name }));
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

  public onInstanceGroupChange(instanceGroup: string) {
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

  public onUserDataChanged(userData: string) {
    this.store.dispatch(new vmActions.VmFormUpdate({ userData }));
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
}
