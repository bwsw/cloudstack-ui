import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '../../../reducers/index';
import { VmService } from '../../shared/vm.service';
import { AuthService } from '../../../shared/services/auth.service';
import { Observable } from 'rxjs/Observable';
import { AffinityGroup, DiskOffering, InstanceGroup, ServiceOffering, SSHKeyPair, Zone } from '../../../shared/models';
import { BaseTemplateModel } from '../../../template/shared';
import { VmCreationSecurityGroupData } from '../security-group/vm-creation-security-group-data';
import { KeyboardLayout } from '../keyboards/keyboards.component';
import { VirtualMachine } from '../../';
import { NotSelected } from '../data/vm-creation-state';

import * as fromVMs from '../../../reducers/vm/redux/vm.reducers';
import * as fromZones from '../../../reducers/zones/redux/zones.reducers';
import * as fromAuth from '../../../reducers/auth/redux/auth.reducers';
import * as fromAffinityGroups from '../../../reducers/affinity-groups/redux/affinity-groups.reducers';
import * as vmActions from '../../../reducers/vm/redux/vm.actions';
import * as templateActions from '../../../reducers/templates/redux/template.actions';
import * as sshKeyActions from '../../../reducers/ssh-keys/redux/ssh-key.actions';
import * as serviceOfferingActions from '../../../reducers/service-offerings/redux/service-offerings.actions';
import * as affinityGroupActions from '../../../reducers/affinity-groups/redux/affinity-groups.actions';

@Component({
  selector: 'cs-vm-create-container',
  template: `
    <cs-vm-create
      [account]="account$ | async"
      [vmCreationState]="vmFormState$ | async"
      [isLoading]="isLoading$ | async"
      [instanceGroupList]="instanceGroups$ | async"
      [affinityGroupList]="affinityGroups$ | async"
      [zones]="zones$ | async"
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
      (sshKeyPairChange)="onSshKeyPairChange($event)"
      (zoneChange)="onZoneChange($event)"
      (doStartVmChange)="onDoStartVmChange($event)"
      (agreementChange)="onAgreementChange($event)"
      (onVmDeploymentFinish)="onVmDeploymentFinished($event)"
    ></cs-vm-create>`
})
export class VmCreationContainerComponent implements OnInit {
  readonly vmFormState$ = this.store.select(fromVMs.getVmFormState);
  readonly isLoading$ = this.store.select(fromVMs.formIsLoading);
  readonly instanceGroups$ = this.store.select(fromVMs.selectVmGroups);
  readonly affinityGroups$ = this.store.select(fromAffinityGroups.selectAll);
  readonly account$ = this.store.select(fromAuth.getUserAccount);
  readonly zones$ = this.store.select(fromZones.selectAll);

  constructor(
    private store: Store<State>,
    private virtualMachineService: VmService,
    private authService: AuthService
  ) {
    this.store.dispatch(new templateActions.LoadTemplatesRequest());
    this.store.dispatch(new sshKeyActions.LoadSshKeyRequest());
    this.store.dispatch(new serviceOfferingActions.LoadOfferingsRequest());
    this.store.dispatch(new serviceOfferingActions.LoadCustomRestrictionsRequest());
    this.store.dispatch(new affinityGroupActions.LoadAffinityGroupsRequest());
    this.getDefaultVmName()
      .subscribe(displayName => this.onDisplayNameChange(displayName));
  }

  public ngOnInit() {
    this.zones$.subscribe(zones => this.onZoneChange(zones[0]));
  }

  public onDisplayNameChange(displayName: string) {
    console.log('displayName', displayName);
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
    if (template.isTemplate) {
      const rootDiskSize = template.sizeInGB;
      this.store.dispatch(new vmActions.VmFormUpdate({ template, rootDiskSize }));
    } else {
      this.store.dispatch(new vmActions.VmFormUpdate({ template }));
    }
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

  public onVmDeploymentFinished(vm: VirtualMachine) {
    this.store.dispatch(new vmActions.CreateVmSuccess(vm));
  }

  public onAgreementChange(agreement: boolean) {
    this.store.dispatch(new vmActions.VmFormUpdate({ agreement }));
  }

  private getDefaultVmName(): Observable<string> {
    return this.virtualMachineService.getNumberOfVms().map(numberOfVms => {
      return `vm-${this.authService.user.username}-${numberOfVms + 1}`;
    });
  }
}
