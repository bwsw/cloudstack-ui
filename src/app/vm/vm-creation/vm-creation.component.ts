import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MdlDialogReference } from '../../dialog/dialog-module';
import { DialogService } from '../../dialog/dialog-module/dialog.service';
import { Rules } from '../../security-group/sg-creation/sg-creation.component';
import { DiskOffering, JobsNotificationService } from '../../shared';
import { AffinityGroup, InstanceGroup, ServiceOffering, SSHKeyPair, Zone } from '../../shared/models';
import { BaseTemplateModel } from '../../template/shared';
import { VmCreationData } from './data/vm-creation-data';
import { VmCreationState } from './data/vm-creation-state';
import { VmCreationFormNormalizationService } from './form-normalization.service';
import { KeyboardLayout } from './keyboards/keyboards.component';
import { VmCreationService } from './vm-creation.service';
import { VmDeploymentService, VmDeploymentStages } from './vm-deployment.service';
import throttle = require('lodash/throttle');


export interface VmCreationFormState {
  data: VmCreationData,
  state: VmCreationState
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
    instances: 'VM_CREATION_FORM.RESOURCES.INSTANCES',
    ips: 'VM_CREATION_FORM.RESOURCES.IPS',
    volumes: 'VM_CREATION_FORM.RESOURCES.VOLUMES',
    cpus: 'VM_CREATION_FORM.RESOURCES.CPUS',
    memory: 'VM_CREATION_FORM.RESOURCES.MEMORY',
    primaryStorage: 'VM_CREATION_FORM.RESOURCES.PRIMARYSTORAGE',
  };

  public takenName: string;
  public sgCreationInProgress = false;
  public agCreationInProgress = false;

  constructor(
    private cd: ChangeDetectorRef,
    private dialog: MdlDialogReference,
    private dialogService: DialogService,
    private formNormalizationService: VmCreationFormNormalizationService,
    private jobsNotificationService: JobsNotificationService,
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
    this.enoughResources = true;
    this.vmCreationService.getData().subscribe(vmCreationData => {
      this.data = vmCreationData;
      this.updateFormState();
      this.fetching = false;
    });
  }

  public get showResizeSlider(): boolean {
    return this.formState.state.template.isTemplate || this.formState.state.showRootDiskResize;
  }

  public displayNameChange(value: string): void {
    this.formState.state.displayName = value;
    this.updateFormState();
  }

  public zoneChange(value: Zone) {
    this.formState.state.zone = value;
    this.updateFormState();
  }

  public serviceOfferingChange(value: ServiceOffering) {
    this.formState.state.serviceOffering = value;
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

  public sshKeyPairChange(value: SSHKeyPair) {
    this.formState.state.sshKeyPair = value;
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
    this.dialog.hide(Observable.of());
  }

  public deploy(): void {
    const notificationId = this.jobsNotificationService.add('VM_DEPLOY_IN_PROGRESS');
    this.vmDeploymentService.deploy(this.formState.state)
      .subscribe(deploymentMessage => {
        switch (deploymentMessage.stage) {
          case VmDeploymentStages.AG_GROUP_CREATION:
            this.agCreationInProgress = true;
            break;
          case VmDeploymentStages.AG_GROUP_CREATION_FINISHED:
            this.agCreationInProgress = false;
            break;
          case VmDeploymentStages.SG_GROUP_CREATION:
            this.sgCreationInProgress = true;
            break;
          case VmDeploymentStages.SG_GROUP_CREATION_FINISHED:
            this.sgCreationInProgress = false;
            break;
          case VmDeploymentStages.TEMP_VM:
            this.dialog.hide();
            break;
          case VmDeploymentStages.FINISHED:
            const name = deploymentMessage.vm.name;
            const password = deploymentMessage.vm.password;

            this.showPassword(name, password);
            this.notifyOnDeployDone(notificationId);
            break;
          case VmDeploymentStages.ERROR:
            this.notifyOnDeployFailed(notificationId);
            break;
        }
      });
  }

  public notifyOnDeployDone(notificationId: string): void {
    this.jobsNotificationService.finish({
      id: notificationId,
      message: 'DEPLOY_DONE'
    });
  }

  public notifyOnDeployFailed(notificationId: string): void {
    this.jobsNotificationService.fail({
      id: notificationId,
      message: 'DEPLOY_FAILED'
    });
  }

  public showPassword(vmName: string, vmPassword: string): void {
    this.dialogService.customAlert({
      message: {
        translationToken: 'PASSWORD_DIALOG_MESSAGE',
        interpolateParams: { vmName, vmPassword }
      },
      width: '400px',
      clickOutsideToClose: false
    });
  }
}
