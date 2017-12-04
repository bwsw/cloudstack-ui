import { Component, OnInit, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Store } from '@ngrx/store';
import { State } from '../../reducers/index';
import { ProgressLoggerController } from '../../shared/components/progress-logger/progress-logger.service';
import { AffinityGroup, InstanceGroup, ServiceOffering, SSHKeyPair, Zone } from '../../shared/models';
import { DiskOffering, Account } from '../../shared/models';
import { JobsNotificationService } from '../../shared/services/jobs-notification.service';
import { ResourceUsageService } from '../../shared/services/resource-usage.service';
import { BaseTemplateModel } from '../../template/shared';
import { VirtualMachine } from '../shared/vm.model';
import { NotSelected } from '../../vm/vm-creation/data/vm-creation-state';
import { VmDeploymentMessage, VmDeploymentService, VmDeploymentStage } from './services/vm-deployment.service';
import { VmCreationSecurityGroupData } from './security-group/vm-creation-security-group-data';
import { ParametrizedTranslation } from '../../dialog/dialog-service/dialog.service';
import { AuthService } from '../../shared/services/auth.service';
import { TemplateTagService } from '../../shared/services/tags/template-tag.service';
import { Observable } from 'rxjs/Observable';
import { VmCreationAgreementComponent } from './template/agreement/vm-creation-agreement.component';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  ICustomOfferingRestrictions
} from '../../service-offering/custom-service-offering/custom-offering-restrictions';
import {
  ProgressLoggerMessage,
  ProgressLoggerMessageStatus
} from '../../shared/components/progress-logger/progress-logger-message/progress-logger-message';

import * as clone from 'lodash/clone';
import { VmCreationContainerComponent } from './containers/vm-creation.container';

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
  @Input() public account: Account;
  @Input() public vmCreationState: any;
  @Input() public isLoading = false;
  @Input() public instanceGroupList: InstanceGroup[];
  @Input() public affinityGroupList: AffinityGroup[];
  @Input() public zones: Zone[];
  @Input() public serviceOfferings: ServiceOffering[];
  @Input() public customOfferingRestrictions: ICustomOfferingRestrictions;

  @Output() public displayNameChange = new EventEmitter<string>();
  @Output() public serviceOfferingChange = new EventEmitter<ServiceOffering>();
  @Output() public diskOfferingChange = new EventEmitter<DiskOffering>();
  @Output() public rootDiskSizeMinChange = new EventEmitter<number>();
  @Output() public rootDiskSizeChange = new EventEmitter<number>();
  @Output() public affinityGroupChange = new EventEmitter<AffinityGroup>();
  @Output() public instanceGroupChange = new EventEmitter<InstanceGroup>();
  @Output() public securityRulesChange = new EventEmitter<VmCreationSecurityGroupData>();
  @Output() public keyboardChange = new EventEmitter<VmCreationSecurityGroupData>();
  @Output() public templateChange = new EventEmitter<BaseTemplateModel>();
  @Output() public sshKeyPairChange = new EventEmitter<SSHKeyPair | NotSelected>();
  @Output() public doStartVmChange = new EventEmitter<boolean>();
  @Output() public zoneChange = new EventEmitter<Zone>();
  @Output() public agreementChange = new EventEmitter<boolean>();
  @Output() public onVmDeploymentFinish = new EventEmitter<VirtualMachine>();

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

  public get nameIsTaken(): boolean {
    return !!this.vmCreationState && this.vmCreationState.state.displayName === this.takenName;
  }

  public get diskOfferingsAreAllowed(): boolean {
    return this.vmCreationState
      && this.vmCreationState.state.template
      && !this.vmCreationState.state.template.isTemplate;
  }

  public get rootDiskSizeLimit(): number {
    return this.account && this.account.primarystorageavailable;
  }

  public get showRootDiskResize(): boolean {
    return this.vmCreationState.state.diskOffering && this.vmCreationState.state.diskOffering.isCustomized;
  }

  public get securityGroupsAreAllowed(): boolean {
    return this.vmCreationState.state.zone && !this.vmCreationState.state.zone.networkTypeIsBasic;
  }

  public get doCreateAffinityGroup(): boolean {
    return (
      this.vmCreationState.state.affinityGroup &&
      this.vmCreationState.state.affinityGroup.name &&
      !this.affinityGroupExists
    );
  }

  public get affinityGroupExists(): boolean {
    return this.vmCreationState.state.affinityGroupNames.includes(this.vmCreationState.state.affinityGroup.name);
  }

  public get doCreateInstanceGroup(): boolean {
    return this.vmCreationState.state.instanceGroup && !!this.vmCreationState.state.instanceGroup.name;
  }

  public get doCopyTags(): boolean {
    return true;
  }

  constructor(
    public dialogRef: MatDialogRef<VmCreationContainerComponent>,
    private jobsNotificationService: JobsNotificationService,
    private resourceUsageService: ResourceUsageService,
    private vmDeploymentService: VmDeploymentService,
    private store: Store<State>,
    private templateTagService: TemplateTagService,
    private auth: AuthService,
    private dialog: MatDialog
  ) {
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
          this.visibleInstanceGroups = this.instanceGroupList;
          this.visibleAffinityGroups = this.affinityGroupList;
        }
        this.fetching = false;
      });
  }


  public get showResizeSlider(): boolean {
    return !!this.vmCreationState.state.template
      && !this.vmCreationState.state.template.isTemplate
      && this.vmCreationState.state.showRootDiskResize
      && !!this.vmCreationState.state.rootDiskSizeMin;
  }

  public get showSecurityGroups(): boolean {
    return !!this.vmCreationState.state.zone
      && this.vmCreationState.state.zone.securitygroupsenabled
      && this.auth.isSecurityGroupEnabled();
  }

  public changeTemplate(value: BaseTemplateModel) {
    this.agreementChange.emit(value.agreementAccepted);
    this.templateChange.emit(value);
  }

  public changeInstanceGroup(groupName: string): void {
    const val = groupName.toLowerCase();
    this.visibleInstanceGroups = this.instanceGroupList.filter(
      g => g.name.toLowerCase().indexOf(val) === 0
    );

    const existingGroup = this.getInstanceGroup(groupName);
    const instanceGroup = clone(existingGroup) || new InstanceGroup(groupName);
    this.instanceGroupChange.emit(instanceGroup);
  }

  public getInstanceGroup(name: string): InstanceGroup {
    return this.instanceGroupList.find(group => group.name === name);
  }

  public changeAffinityGroup(groupName: string): void {
    const val = groupName.toLowerCase();
    this.visibleAffinityGroups = this.affinityGroupList.filter(
      g => g.name.toLowerCase().indexOf(val) === 0
    );
    const existingGroup = this.getAffinityGroup(groupName);

    this.affinityGroupChange.emit(clone(existingGroup) || new AffinityGroup({ name: groupName }));
  }

  public getAffinityGroup(name: string): AffinityGroup {
    return this.affinityGroupList.find(group => group.name === name);
  }

  public onVmCreationSubmit(e: any): void {
    e.preventDefault();
    this.deploy();
  }

  public deploy(): void {
    this.templateTagService.getAgreement(this.vmCreationState.state.template)
      .switchMap(res => res ? this.showTemplateAgreementDialog() : Observable.of(true))
      .filter(res => !!res)
      .subscribe(() => {
        this.agreementChange.emit(true);
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
      this.vmCreationState.state);

    this.initializeDeploymentActionList();

    deployStatusObservable.subscribe(deploymentMessage => {
      this.handleDeploymentMessages(deploymentMessage, notificationId);
    });
    deployObservable.subscribe();
  }


  private showTemplateAgreementDialog(): Observable<boolean> {
    return this.dialog.open(VmCreationAgreementComponent, {
      width: '900px',
      data: this.vmCreationState.state.template
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

  private initializeDeploymentActionList(): void {
    const translations = {
      'AG_GROUP_CREATION': 'VM_PAGE.VM_CREATION.CREATING_AG',
      'SG_GROUP_CREATION': 'VM_PAGE.VM_CREATION.CREATING_SG',
      'VM_CREATION_IN_PROGRESS': 'VM_PAGE.VM_CREATION.DEPLOYING_VM',
      'INSTANCE_GROUP_CREATION': 'VM_PAGE.VM_CREATION.CREATING_INSTANCE_GROUP',
      'TAG_COPYING': 'VM_PAGE.VM_CREATION.TAG_COPYING'
    };

    this.deploymentActionList
      .forEach(actionName => {
        return this.progressLoggerController.addMessage({
          text: translations[actionName]
        });
      });

    this.loggerStageList = this.progressLoggerController.messages;
  }


  public get deploymentActionList(): Array<VmDeploymentStage> {
    return [
      this.doCreateAffinityGroup ? VmDeploymentStage.AG_GROUP_CREATION : null,
      this.securityGroupsAreAllowed ? VmDeploymentStage.SG_GROUP_CREATION : null,
      VmDeploymentStage.VM_CREATION_IN_PROGRESS,
      this.doCreateInstanceGroup ? VmDeploymentStage.INSTANCE_GROUP_CREATION : null,
      this.doCopyTags ? VmDeploymentStage.TAG_COPYING : null
    ]
      .filter(_ => _);
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
    this.onVmDeploymentFinish.emit(this.deployedVm);
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
