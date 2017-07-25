import { Component, OnInit } from '@angular/core';
import { MdSelectChange } from '@angular/material';

import { MdlDialogReference } from '../../dialog/dialog-module';
import { DialogService } from '../../dialog/dialog-module/dialog.service';
import { Rules } from '../../security-group/sg-creation/sg-creation.component';
import { DiskOffering, JobsNotificationService } from '../../shared';
import { AffinityGroup, InstanceGroup, ServiceOffering } from '../../shared/models';
import { ResourceUsageService } from '../../shared/services';
import { BaseTemplateModel } from '../../template/shared';
import { VirtualMachine } from '../shared/vm.model';
import { VmCreationData } from './data/vm-creation-data';
import { VmCreationState } from './data/vm-creation-state';
import { VmCreationFormNormalizationService } from './form-normalization/form-normalization.service';
import { KeyboardLayout } from './keyboards/keyboards.component';
import { NotSelected, VmCreationService } from './vm-creation.service';
import { VmDeploymentMessage, VmDeploymentService, VmDeploymentStages } from './vm-deployment.service';
import throttle = require('lodash/throttle');


export interface VmCreationFormState {
  data: VmCreationData,
  state: VmCreationState
}

export type VmCreationStage =
  'agCreationInProgress' |
  'editing' |
  'sgCreationInProgress' |
  'vmDeploymentInProgress';

export const VmCreationStages = {
  agCreationInProgress: 'agCreationInProgress' as VmCreationStage,
  editing: 'editing' as VmCreationStage,
  sgCreationInProgress: 'sgCreationInProgress' as VmCreationStage,
  vmDeploymentInProgress: 'vmDeployInProgress' as VmCreationStage
};

@Component({
  selector: 'cs-vm-create',
  templateUrl: 'vm-creation.component.html',
  styleUrls: ['vm-creation.component.scss']
})
export class VmCreationComponent implements OnInit {
  public data: VmCreationData;
  public formState: VmCreationFormState;

  public fetching: boolean;
  public enoughResources: boolean;
  public insufficientResources: Array<string> = [];
  public insufficientResourcesErrorMap = {
    instances: 'VM_CREATION_FORM.RESOURCES.INSTANCES',
    ips: 'VM_CREATION_FORM.RESOURCES.IPS',
    volumes: 'VM_CREATION_FORM.RESOURCES.VOLUMES',
    cpus: 'VM_CREATION_FORM.RESOURCES.CPUS',
    memory: 'VM_CREATION_FORM.RESOURCES.MEMORY',
    primaryStorage: 'VM_CREATION_FORM.RESOURCES.PRIMARYSTORAGE',
  };

  public takenName: string;
  public creationStage = VmCreationStages.editing;

  constructor(
    private dialog: MdlDialogReference,
    private dialogService: DialogService,
    private formNormalizationService: VmCreationFormNormalizationService,
    private jobsNotificationService: JobsNotificationService,
    private resourceUsageService: ResourceUsageService,
    private vmCreationService: VmCreationService,
    private vmDeploymentService: VmDeploymentService
  ) {
    this.updateFormState = throttle(
      this.updateFormState,
      500,
      {
        leading: true,
        trailing: false
      }
    );
  }

  public ngOnInit(): void {
    this.fetching = true;
    this.resourceUsageService.getResourceUsage()
      .subscribe(resourceUsage => {
        Object.keys(resourceUsage.available)
          .filter(key => key !== 'snapshots' && key !== 'secondaryStorage')
          .forEach(key => {
            const available = resourceUsage.available[key];
            if (available === 0) {
              this.insufficientResources.push(key);
            }
          });

        this.enoughResources = !this.insufficientResources.length;

        if (this.enoughResources) {
          this.loadData();
        } else {
          this.fetching = false;
        }
      });
  }

  public get showResizeSlider(): boolean {
    return this.formState.state.template.isTemplate || this.formState.state.showRootDiskResize;
  }

  public get showOverlay(): boolean {
    return this.creationStage !== VmCreationStages.editing;
  }

  public get showAffinityGroupOverlay(): boolean {
    return this.creationStage === VmCreationStages.agCreationInProgress;
  }

  public get showSecurityGroupOverlay(): boolean {
    return this.creationStage === VmCreationStages.sgCreationInProgress;
  }

  public get showDeploymentOverlay(): boolean {
    return this.creationStage === VmCreationStages.vmDeploymentInProgress;
  }

  public displayNameChange(value: string): void {
    this.formState.state.displayName = value;
    this.updateFormState();
  }

  public zoneChange(change: MdSelectChange) {
    this.formState.state.zone = change.value;
    this.updateFormState();
  }

  public serviceOfferingChange(offering: ServiceOffering) {
    this.formState.state.serviceOffering = offering;
    if (offering.areCustomParamsSet) {
      this.data.serviceOfferings = this.data.serviceOfferings.map(_ =>
        _.id === offering.id ? offering : _
      );
    }
    this.updateFormState();
  }

  public templateChange(value: BaseTemplateModel) {
    this.formState.state.template = value;
    this.updateFormState();
  }

  public diskOfferingChange(value: DiskOffering) {
    this.formState.state.diskOffering = value;
    this.updateFormState();
  }

  public rootDiskSizeChange($event) {
    this.formState.state.rootDiskSize = $event.value;
    this.updateFormState();
  }

  public instanceGroupChange(value: string): void {
    const existingGroup = this.formState.data.getInstanceGroup(value);

    if (existingGroup) {
      this.formState.state.instanceGroup = existingGroup;
    } else {
      this.formState.state.instanceGroup = new InstanceGroup(value);
    }

    this.updateFormState();
  }

  public affinityGroupChange(value: string): void {
    const existingGroup = this.formState.data.getAffinityGroup(value);

    if (existingGroup) {
      this.formState.state.affinityGroup = existingGroup;
    } else {
      this.formState.state.affinityGroup = new AffinityGroup({ name: value });
    }

    this.updateFormState();
  }

  public securityRulesChange(value: Rules) {
    this.formState.state.securityRules = value;
    this.updateFormState();
  }

  public keyboardChange(value: KeyboardLayout) {
    this.formState.state.keyboard = value;
  }

  public sshKeyPairChange(change: MdSelectChange) {
    this.formState.state.sshKeyPair = change.value;
    this.updateFormState();
  }

  public doStartVmChange(value: boolean) {
    this.formState.state.doStartVm = value;
    this.updateFormState();
  }

  public updateFormState(): void {
    const state = this.formState && this.formState.state || this.data.getInitialState();
    this.formState = this.formNormalizationService.normalize(
      {
        data: this.data,
        state
      }
    );
  }

  public onVmCreationSubmit(e: any): void {
    e.preventDefault();
    this.deploy();
  }

  public onCancel(): void {
    this.dialog.hide();
  }

  public deploy(): void {
    const notificationId = this.jobsNotificationService.add('VM_DEPLOY_IN_PROGRESS');
    const { deployStatusObservable, deployObservable } = this.vmDeploymentService.deploy(this.formState.state);

    deployStatusObservable.subscribe(deploymentMessage => {
      this.handleDeploymentMessages(deploymentMessage, notificationId);
    });
    deployObservable.subscribe();
  }

  public notifyOnDeployDone(notificationId: string): void {
    this.jobsNotificationService.finish({
      id: notificationId,
      message: 'DEPLOY_DONE'
    });
  }

  public notifyOnDeployFailed(error: any, notificationId: string): void {
    this.dialogService.alert({
      translationToken: error.message,
      interpolateParams: error.params
    });
    this.jobsNotificationService.fail({
      id: notificationId,
      message: 'DEPLOY_FAILED'
    });
  }

  public showPassword(vm: VirtualMachine): void {
    if (!vm.passwordEnabled) {
      return;
    }

    this.dialogService.customAlert({
      message: {
        translationToken: 'PASSWORD_DIALOG_MESSAGE',
        interpolateParams: {
          vmName: vm.name,
          vmPassword: vm.password
        }
      },
      width: '400px',
      clickOutsideToClose: false
    });
  }

  private handleDeploymentMessages(deploymentMessage: VmDeploymentMessage, notificationId: string): void {
    switch (deploymentMessage.stage) {
      case VmDeploymentStages.STARTED:
        this.creationStage = VmCreationStages.vmDeploymentInProgress;
        break;
      case VmDeploymentStages.AG_GROUP_CREATION:
        this.creationStage = VmCreationStages.agCreationInProgress;
        break;
      case VmDeploymentStages.AG_GROUP_CREATION_FINISHED:
        this.creationStage = VmCreationStages.vmDeploymentInProgress;
        break;
      case VmDeploymentStages.SG_GROUP_CREATION:
        this.creationStage = VmCreationStages.sgCreationInProgress;
        break;
      case VmDeploymentStages.SG_GROUP_CREATION_FINISHED:
        this.creationStage = VmCreationStages.vmDeploymentInProgress;
        break;
      case VmDeploymentStages.IN_PROGRESS:
        this.creationStage = VmCreationStages.vmDeploymentInProgress;
        break;
      case VmDeploymentStages.TEMP_VM:
        this.dialog.hide(deploymentMessage.vm);
        break;
      case VmDeploymentStages.FINISHED:
        this.dialog.hide();
        this.showPassword(deploymentMessage.vm);
        this.notifyOnDeployDone(notificationId);
        break;
      case VmDeploymentStages.ERROR:
        this.dialog.hide();
        this.notifyOnDeployFailed(deploymentMessage.error, notificationId);
        break;
    }
  }

  private loadData(): void {
    this.fetching = true;
    this.vmCreationService.getData().subscribe(vmCreationData => {
      this.data = vmCreationData;
      this.updateFormState();
      this.fetching = false;
    });
  }
}
