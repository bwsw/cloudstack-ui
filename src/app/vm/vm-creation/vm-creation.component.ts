import { Component, forwardRef, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
  MatSelectChange
} from '@angular/material';
import { Store } from '@ngrx/store';
import { State } from '../../reducers/index';
import { ProgressLoggerController } from '../../shared/components/progress-logger/progress-logger.service';
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
import { VmCreationSecurityGroupData } from './security-group/vm-creation-security-group-data';
import { ParametrizedTranslation } from '../../dialog/dialog-service/dialog.service';
import { TemplateTagService } from '../../shared/services/tags/template-tag.service';
import { Observable } from 'rxjs/Observable';
import { VmCreationAgreementComponent } from './template/agreement/vm-creation-agreement.component';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import {
  ProgressLoggerMessage,
  ProgressLoggerMessageStatus
} from '../../shared/components/progress-logger/progress-logger-message/progress-logger-message';
import {
  VmDeploymentMessage,
  VmDeploymentService,
  VmDeploymentStage
} from './services/vm-deployment.service';

import * as vmActions from '../../reducers/vm/redux/vm.actions';
import * as clone from 'lodash/clone';
import * as throttle from 'lodash/throttle';

export interface VmCreationFormState {
  data: VmCreationData;
  state: VmCreationState;
}

@Component({
  selector: 'cs-vm-create',
  templateUrl: 'vm-creation.component.html',
  styleUrls: ['vm-creation.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => VmCreationAgreementComponent),
      multi: true
    }
  ]
})
export class VmCreationComponent implements OnInit {
  public data: VmCreationData;
  public formState: VmCreationFormState;
  public deployedVm: VirtualMachine;

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
  public deploymentStopped = false;
  public maxEntityNameLength = 63;
  public loggerStageList: Array<ProgressLoggerMessage>;

  public visibleAffinityGroups: Array<AffinityGroup>;
  public visibleInstanceGroups: Array<InstanceGroup>;

  constructor(
    public dialogRef: MatDialogRef<VmCreationComponent>,
    private formNormalizationService: VmCreationFormNormalizationService,
    private jobsNotificationService: JobsNotificationService,
    private resourceUsageService: ResourceUsageService,
    private vmCreationService: VmCreationService,
    private vmDeploymentService: VmDeploymentService,
    private store: Store<State>,
    private templateTagService: TemplateTagService,
    private dialog: MatDialog,
    private auth: AuthService,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.updateFormState = throttle(this.updateFormState, 500, {
      leading: true,
      trailing: false
    });
  }

  public ngOnInit(): void {
    this.fetching = true;
    this.resourceUsageService.getResourceUsage()
      .subscribe(resourceUsage => {
        // TODO check ips
        Object.keys(resourceUsage.available)
          .filter(
            key => key !== 'snapshots' && key !== 'secondaryStorage' && key !== 'ips')
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

  public get nameIsTaken(): boolean {
    return !!this.formState && this.formState.state.displayName === this.takenName;
  }

  public get showResizeSlider(): boolean {
    return (
      !!this.formState.state.template &&
      (this.formState.state.template.isTemplate ||
        this.formState.state.showRootDiskResize)
    );
  }

  public get showSecurityGroups(): boolean {
    return !!this.formState.state.zone
      && this.formState.state.zone.securitygroupsenabled
      && this.auth.isSecurityGroupEnabled();
  }

  public displayNameChange(value: string): void {
    this.formState.state.displayName = value;
    this.updateFormState();
  }

  public zoneChange(change: MatSelectChange) {
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
    if (value.agreementAccepted) {
      this.formState.state.agreement = true;
    }
    this.updateFormState();
  }

  public diskOfferingChange(change: MatSelectChange) {
    if (change) {
      const diskOffering = change.value as DiskOffering;
      this.formState.state.diskOffering = diskOffering;
    }
    this.updateFormState();
  }

  public rootDiskSizeChange($event) {
    if (!isNaN($event)) {
      this.formState.state.rootDiskSize = $event;
      this.updateFormState();
    }
  }

  public instanceGroupChange(groupName: string): void {
    const val = groupName.toLowerCase();
    this.visibleInstanceGroups = this.formState.data.instanceGroups.filter(
      g => g.name.toLowerCase().indexOf(val) === 0
    );

    const existingGroup = this.formState.data.getInstanceGroup(groupName);
    this.formState.state.instanceGroup = clone(existingGroup) || new InstanceGroup(
      groupName);
    this.updateFormState();
  }

  public affinityGroupChange(groupName: string): void {
    const val = groupName.toLowerCase();
    this.visibleAffinityGroups = this.formState.data.affinityGroupList.filter(
      g => g.name.toLowerCase().indexOf(val) === 0
    );
    const existingGroup = this.formState.data.getAffinityGroup(groupName);

    this.formState.state.affinityGroup =
      clone(existingGroup) || new AffinityGroup({ name: groupName });
    this.updateFormState();
  }

  public securityRulesChange(value: VmCreationSecurityGroupData) {
    this.formState.state.securityGroupData = value;
    this.updateFormState();
  }

  public keyboardChange(value: KeyboardLayout) {
    this.formState.state.keyboard = value;
  }

  public sshKeyPairChange(change: MatSelectChange) {
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

  public deploy(): void {
    this.templateTagService.getAgreement(this.formState.state.template)
      .switchMap(res => res ? this.showTemplateAgreementDialog() : Observable.of(true))
      .filter(res => !!res)
      .subscribe(() => {
        this.formState.state.agreement = true;
        this.deployRequest();
      });
  }

  private deployRequest() {
    const notificationId = this.jobsNotificationService.add(
      'JOB_NOTIFICATIONS.VM.DEPLOY_IN_PROGRESS'
    );

    const {
      deployStatusObservable,
      deployObservable
    } = this.vmDeploymentService.deploy(
      this.formState.state);

    this.initializeDeploymentActionList();

    deployStatusObservable.subscribe(deploymentMessage => {
      this.handleDeploymentMessages(deploymentMessage, notificationId);
    });
    deployObservable.subscribe();
  }


  private showTemplateAgreementDialog(): Observable<boolean> {
    return this.dialog.open(VmCreationAgreementComponent, {
      width: '900px',
      data: this.formState.state.template
    })
      .afterClosed();
  }

  public notifyOnDeployDone(notificationId: string): void {
    this.jobsNotificationService.finish({
      id: notificationId,
      message: 'JOB_NOTIFICATIONS.VM.DEPLOY_DONE'
    });
  }

  public notifyOnDeployFailed(error: any, notificationId: string): void {
    this.deploymentStopped = false;

    this.progressLoggerController.addMessage({
      text: error.params
        ? {
          translationToken: error.message,
          interpolateParams: error.params
        }
        : error.message,
      status: [ProgressLoggerMessageStatus.ErrorMessage]
    });

    const inProgressMessage = this.progressLoggerController.messages.find(message => {
      return message.status && message.status.includes(ProgressLoggerMessageStatus.InProgress);
    });

    this.updateLoggerMessage(
      inProgressMessage && inProgressMessage.text,
      [ProgressLoggerMessageStatus.Error]
    );

    this.jobsNotificationService.fail({
      id: notificationId,
      message: 'JOB_NOTIFICATIONS.VM.DEPLOY_FAILED'
    });
  }

  // public vmNameErrorMatcher(control: FormControl): boolean {
  //   return control.invalid || this.nameIsTaken;
  // }

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
      this.visibleInstanceGroups = vmCreationData.instanceGroups;
      this.visibleAffinityGroups = vmCreationData.affinityGroupList;
      this.updateFormState();
      this.fetching = false;
    });
  }

  private initializeDeploymentActionList(): void {
    const translations = {
      'AG_GROUP_CREATION': 'VM_PAGE.VM_CREATION.CREATING_AG',
      'SG_GROUP_CREATION': 'VM_PAGE.VM_CREATION.CREATING_SG',
      'VM_CREATION_IN_PROGRESS': 'VM_PAGE.VM_CREATION.DEPLOYING_VM',
      'INSTANCE_GROUP_CREATION': 'VM_PAGE.VM_CREATION.CREATING_INSTANCE_GROUP',
      'TAG_COPYING': 'VM_PAGE.VM_CREATION.TAG_COPYING'
    };

    this.formState.state.deploymentActionList
      .forEach(actionName => {
        return this.progressLoggerController.addMessage({
          text: translations[actionName]
        });
      });

    this.loggerStageList = this.progressLoggerController.messages;
  }

  private onVmDeploymentStarted(): void {
    this.showOverlay = true;
    this.deploymentStopped = true;
  }

  private onAffinityGroupCreation(): void {
    this.updateLoggerMessage(
      'VM_PAGE.VM_CREATION.CREATING_AG',
      [
        ProgressLoggerMessageStatus.Highlighted,
        ProgressLoggerMessageStatus.InProgress
      ]
    );
  }

  private onAffinityGroupCreationFinished(): void {
    this.updateLoggerMessage(
      'VM_PAGE.VM_CREATION.CREATING_AG',
      [ProgressLoggerMessageStatus.Done]
    );
  }

  private onSecurityGroupCreation(): void {
    this.updateLoggerMessage(
      'VM_PAGE.VM_CREATION.CREATING_SG',
      [
        ProgressLoggerMessageStatus.Highlighted,
        ProgressLoggerMessageStatus.InProgress
      ]
    );
  }

  private onSecurityGroupCreationFinished(): void {
    this.updateLoggerMessage(
      'VM_PAGE.VM_CREATION.CREATING_SG',
      [ProgressLoggerMessageStatus.Done]
    );
  }

  private onVmCreationInProgress(): void {
    this.updateLoggerMessage(
      'VM_PAGE.VM_CREATION.DEPLOYING_VM',
      [
        ProgressLoggerMessageStatus.Highlighted,
        ProgressLoggerMessageStatus.InProgress
      ]
    );
  }

  private onVmCreationFinished(): void {
    this.updateLoggerMessage(
      'VM_PAGE.VM_CREATION.DEPLOYING_VM',
      [ProgressLoggerMessageStatus.Done]
    );
  }

  private onInstanceGroupCreation(): void {
    this.updateLoggerMessage(
      'VM_PAGE.VM_CREATION.CREATING_INSTANCE_GROUP',
      [
        ProgressLoggerMessageStatus.Highlighted,
        ProgressLoggerMessageStatus.InProgress
      ]
    );
  }

  private onInstanceGroupCreationFinished(): void {
    this.updateLoggerMessage(
      'VM_PAGE.VM_CREATION.CREATING_INSTANCE_GROUP',
      [ProgressLoggerMessageStatus.Done]
    );
  }

  private onTagCopying(): void {
    this.updateLoggerMessage(
      'VM_PAGE.VM_CREATION.TAG_COPYING',
      [
        ProgressLoggerMessageStatus.Highlighted,
        ProgressLoggerMessageStatus.InProgress
      ]
    );
  }

  private onTagCopyingFinished(): void {
    this.updateLoggerMessage(
      'VM_PAGE.VM_CREATION.TAG_COPYING',
      [ProgressLoggerMessageStatus.Done]
    );
  }

  private onVmDeploymentFinished(
    deploymentMessage: VmDeploymentMessage,
    notificationId: string
  ): void {
    this.deploymentStopped = false;
    this.deployedVm = deploymentMessage.vm;
    // add to store
    this.store.dispatch(new vmActions.CreateVmSuccess(this.deployedVm));
    this.notifyOnDeployDone(notificationId);
    this.progressLoggerController.addMessage({
      text: 'VM_PAGE.VM_CREATION.DEPLOYMENT_FINISHED',
      status: [ProgressLoggerMessageStatus.Highlighted]
    });
  }

  private updateLoggerMessage(
    messageText: string | ParametrizedTranslation,
    status?: Array<ProgressLoggerMessageStatus>
  ): void {

    const updatedMessage = this.loggerStageList.find(message => {
      return message.text === messageText;
    });
    const id = updatedMessage && updatedMessage.id;
    this.progressLoggerController.updateMessage(id, { status });
  }
}
