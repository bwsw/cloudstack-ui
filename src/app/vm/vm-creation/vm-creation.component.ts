import { Component, OnInit } from '@angular/core';
import { MdSelectChange, MdDialogRef } from '@angular/material';
import * as throttle from 'lodash/throttle';

import { DialogService } from '../../dialog/dialog-service/dialog.service';
import { Rules } from '../../security-group/sg-creation/sg-creation.component';
import { AffinityGroup, InstanceGroup, ServiceOffering } from '../../shared/models';
import { DiskOffering } from '../../shared/models/disk-offering.model';
import { JobsNotificationService } from '../../shared/services/jobs-notification.service';
import { ResourceUsageService } from '../../shared/services/resource-usage.service';
import { BaseTemplateModel } from '../../template/shared';
import { VirtualMachine } from '../shared/vm.model';
import { VmCreationData } from './data/vm-creation-data';
import { VmCreationState } from './data/vm-creation-state';
import { VmCreationFormNormalizationService } from './form-normalization/form-normalization.service';
import { KeyboardLayout } from './keyboards/keyboards.component';
import { VmCreationService } from './services/vm-creation.service';
import {
  VmDeploymentMessage,
  VmDeploymentService,
  VmDeploymentStage
} from './services/vm-deployment.service';
import { ProgressLoggerController } from '../../shared/components/progress-logger/progress-logger.service';
import { ProgressLoggerMessageStatus } from '../../shared/components/progress-logger/progress-logger-message/progress-logger-message';

export interface VmCreationFormState {
  data: VmCreationData;
  state: VmCreationState;
}

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
    instances: 'VM_PAGE.VM_CREATION.INSTANCES',
    ips: 'VM_PAGE.VM_CREATION.IPS',
    volumes: 'VM_PAGE.VM_CREATION.VOLUMES',
    cpus: 'VM_PAGE.VM_CREATION.CPUS',
    memory: 'VM_PAGE.VM_CREATION.MEMORY',
    primaryStorage: 'VM_PAGE.VM_CREATION.PRIMARY_STORAGE'
  };

  public takenName: string;
  public progressLoggerController = new ProgressLoggerController();
  public showOverlay = false;
  public showOverlayProgress = false;

  constructor(
    private dialogRef: MdDialogRef<VmCreationComponent>,
    private dialogService: DialogService,
    private formNormalizationService: VmCreationFormNormalizationService,
    private jobsNotificationService: JobsNotificationService,
    private resourceUsageService: ResourceUsageService,
    private vmCreationService: VmCreationService,
    private vmDeploymentService: VmDeploymentService
  ) {
    this.updateFormState = throttle(this.updateFormState, 500, {
      leading: true,
      trailing: false
    });
  }

  public ngOnInit(): void {
    this.fetching = true;
    this.resourceUsageService.getResourceUsage().subscribe(resourceUsage => {
      // TODO check ips
      Object.keys(resourceUsage.available)
        .filter(
          key => key !== 'snapshots' && key !== 'secondaryStorage' && key !== 'ips'
        )
        .forEach(key => {
          const available = resourceUsage.available[key];
          if (available === 0) {
            this.insufficientResources.push(key);
          }
        });

      this.enoughResources = !this.insufficientResources.length;

      if (this.enoughResources) {
        // TODO fix me (requests cancellation because of share())
        setTimeout(() => this.loadData());
      } else {
        this.fetching = false;
      }
    });
  }

  public get showResizeSlider(): boolean {
    return (
      this.formState.state.template.isTemplate ||
      this.formState.state.showRootDiskResize
    );
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
      this.data.serviceOfferings = this.data.serviceOfferings.map(
        _ => (_.id === offering.id ? offering : _)
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
    if (!isNaN($event)) {
      this.formState.state.rootDiskSize = $event;
      this.updateFormState();
    }
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
    const state =
      (this.formState && this.formState.state) || this.data.getInitialState();
    this.formState = this.formNormalizationService.normalize({
      data: this.data,
      state
    });
  }

  public onVmCreationSubmit(e: any): void {
    e.preventDefault();
    this.deploy();
  }

  public onCancel(): void {
    this.dialogRef.close();
  }

  public deploy(): void {
    const notificationId = this.jobsNotificationService.add(
      'JOB_NOTIFICATIONS.VM.DEPLOY_IN_PROGRESS'
    );
    const {
      deployStatusObservable,
      deployObservable
    } = this.vmDeploymentService.deploy(this.formState.state);

    deployStatusObservable.subscribe(deploymentMessage => {
      this.handleDeploymentMessages(deploymentMessage, notificationId);
    });
    deployObservable.subscribe();
  }

  public notifyOnDeployDone(notificationId: string): void {
    this.jobsNotificationService.finish({
      id: notificationId,
      message: 'JOB_NOTIFICATIONS.VM.DEPLOY_DONE'
    });
  }

  public notifyOnDeployFailed(error: any, notificationId: string): void {
    this.progressLoggerController.addMessage({
      text: error.message,
      status: ProgressLoggerMessageStatus.Error
    });

    this.jobsNotificationService.fail({
      id: notificationId,
      message: 'JOB_NOTIFICATIONS.VM.DEPLOY_FAILED'
    });
  }

  public showPassword(vm: VirtualMachine): void {
    if (!vm.passwordEnabled) {
      return;
    }

    this.dialogService.alert({
      message: {
        translationToken: 'DIALOG_MESSAGES.VM.PASSWORD_DIALOG_MESSAGE',
        interpolateParams: {
          vmName: vm.name,
          vmPassword: vm.password
        }
      },
      width: '400px',
      disableClose: true
    });
  }

  private handleDeploymentMessages(
    deploymentMessage: VmDeploymentMessage,
    notificationId: string
  ): void {
    switch (deploymentMessage.stage) {
      case VmDeploymentStage.STARTED:
        this.onVmDeploymentStarted();
        break;
      case VmDeploymentStage.AG_GROUP_CREATION:
        this.onAffinityGroupCreation();
        break;
      case VmDeploymentStage.AG_GROUP_CREATION_FINISHED:
        this.onAffinityGroupCreationFinished();
        break;
      case VmDeploymentStage.SG_GROUP_CREATION:
        this.onSecurityGroupCreation();
        break;
      case VmDeploymentStage.SG_GROUP_CREATION_FINISHED:
        this.onSecurityGroupCreationFinished();
        break;
      case VmDeploymentStage.VM_CREATION_IN_PROGRESS:
        this.onVmCreationInProgress();
        break;
      case VmDeploymentStage.FINISHED:
        this.onVmDeploymentFinished(deploymentMessage, notificationId);
        break;
      case VmDeploymentStage.ERROR:
        this.notifyOnDeployFailed(deploymentMessage.error, notificationId);
        break;
      case VmDeploymentStage.INSTANCE_GROUP_CREATION:
        this.onInstanceGroupCreation();
        break;
      case VmDeploymentStage.INSTANCE_GROUP_CREATION_FINISHED:
        this.onInstanceGroupCreationFinished();
        break;
      case VmDeploymentStage.TAG_COPYING:
        this.onTagCopying();
        break;
      case VmDeploymentStage.TAG_COPYING_FINISHED:
        this.onTagCopyingFinished();
        break;
      case VmDeploymentStage.VM_DEPLOYED:
        this.onVmCreationFinished();
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

  private onVmDeploymentStarted(): void {
    this.showOverlay = true;
    this.showOverlayProgress = true;
  }

  private onVmCreationFinished(): void {
    this.completeLastLogMessage();
  }

  private onAffinityGroupCreation(): void {
    this.progressLoggerController.addMessage({
      text: 'VM_PAGE.VM_CREATION.CREATING_AG',
      status: ProgressLoggerMessageStatus.InProgress
    });
  }

  private onAffinityGroupCreationFinished(): void {
    this.completeLastLogMessage();
  }

  private onSecurityGroupCreation(): void {
    this.progressLoggerController.addMessage({
      text: 'VM_PAGE.VM_CREATION.CREATING_SG',
      status: ProgressLoggerMessageStatus.InProgress
    });
  }

  private onSecurityGroupCreationFinished(): void {
    this.completeLastLogMessage();
  }

  private onVmCreationInProgress(): void {
    this.progressLoggerController.addMessage({
      text: 'VM_PAGE.VM_CREATION.DEPLOYING_VM',
      status: ProgressLoggerMessageStatus.InProgress
    });
  }

  private onInstanceGroupCreation(): void {
    this.progressLoggerController.addMessage({
      text: 'VM_PAGE.VM_CREATION.CREATING_INSTANCE_GROUP',
      status: ProgressLoggerMessageStatus.InProgress
    });
  }

  private onInstanceGroupCreationFinished(): void {
    this.completeLastLogMessage();
  }

  private onTagCopying(): void {
    this.progressLoggerController.addMessage({
      text: 'VM_PAGE.VM_CREATION.TAG_COPYING',
      status: ProgressLoggerMessageStatus.InProgress
    });
  }

  private onTagCopyingFinished(): void {
    this.completeLastLogMessage();
  }

  private onVmDeploymentFinished(
    deploymentMessage: VmDeploymentMessage,
    notificationId: string
  ): void {
    this.showOverlayProgress = false;
    this.showPassword(deploymentMessage.vm);
    this.notifyOnDeployDone(notificationId);
    this.progressLoggerController.addMessage({
      text: 'VM_PAGE.VM_CREATION.DEPLOYMENT_FINISHED'
    });
  }

  private completeLastLogMessage(): void {
    this.progressLoggerController
      .updateLastMessageStatus(ProgressLoggerMessageStatus.Done);
  }
}
