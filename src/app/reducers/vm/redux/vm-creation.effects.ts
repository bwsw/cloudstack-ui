import { Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { BaseTemplateModel } from '../../../template/shared';
import { AffinityGroupType, DiskOffering, ServiceOffering, Zone } from '../../../shared/models';
import { FormState } from './vm.reducers';
import { Observable } from 'rxjs/Observable';
import { TemplateResourceType } from '../../../template/shared/base-template.service';
import { Actions, Effect } from '@ngrx/effects';
import { Utils } from '../../../shared/services/utils/utils.service';
import { ParametrizedTranslation } from '../../../dialog/dialog-service/dialog.service';
import {
  ProgressLoggerMessageData,
  ProgressLoggerMessageStatus
} from '../../../shared/components/progress-logger/progress-logger-message/progress-logger-message';
import { NotSelected, VmCreationState } from '../../../vm/vm-creation/data/vm-creation-state';
// tslint:disable-next-line
import { VmCreationAgreementComponent } from '../../../vm/vm-creation/template/agreement/vm-creation-agreement.component';
import { VmService } from '../../../vm/shared/vm.service';
import { MatDialog } from '@angular/material';
import { AuthService } from '../../../shared/services/auth.service';
import { State } from '../../index';
import { JobsNotificationService } from '../../../shared/services/jobs-notification.service';
import { TemplateTagService } from '../../../shared/services/tags/template-tag.service';
import { ResourceUsageService } from '../../../shared/services/resource-usage.service';
import { AffinityGroupService } from '../../../shared/services/affinity-group.service';
import { VmCreationSecurityGroupService } from '../../../vm/vm-creation/services/vm-creation-security-group.service';
import { InstanceGroupService } from '../../../shared/services/instance-group.service';
import { VirtualMachineTagKeys } from '../../../shared/services/tags/vm-tag-keys';
import { TagService } from '../../../shared/services/tags/tag.service';
import { UserTagService } from '../../../shared/services/tags/user-tag.service';
import { VmTagService } from '../../../shared/services/tags/vm-tag.service';
import { NetworkRule } from '../../../security-group/network-rule.model';
import { VirtualMachine } from '../../../vm';
import { VmCreationSecurityGroupMode } from '../../../vm/vm-creation/security-group/vm-creation-security-group-mode';
import { SecurityGroup } from '../../../security-group/sg.model';

import * as fromZones from '../../zones/redux/zones.reducers';
import * as vmActions from './vm.actions';
import * as fromServiceOfferings from '../../service-offerings/redux/service-offerings.reducers';
import * as fromDiskOfferings from '../../disk-offerings/redux/disk-offerings.reducers';
import * as fromTemplates from '../../templates/redux/template.reducers';
import * as fromVMs from './vm.reducers';

interface VmCreationParams {
  affinityGroupNames?: string;
  details?: Array<any>;
  diskofferingid?: string;
  startVm?: string;
  hypervisor?: string;
  ingress?: Array<NetworkRule>;
  egress?: Array<NetworkRule>;
  keyboard?: string;
  keyPair?: string;
  name?: string;
  securityGroupIds?: string;
  serviceOfferingId?: string;
  rootDiskSize?: number;
  size?: number;
  templateId?: string;
  zoneId?: string;
}

export enum VmDeploymentStage {
  STARTED = 'STARTED',
  VM_CREATION_IN_PROGRESS = 'VM_CREATION_IN_PROGRESS',
  AG_GROUP_CREATION = 'AG_GROUP_CREATION',
  AG_GROUP_CREATION_FINISHED = 'AG_GROUP_CREATION_FINISHED',
  SG_GROUP_CREATION = 'SG_GROUP_CREATION',
  SG_GROUP_CREATION_FINISHED = 'SG_GROUP_CREATION_FINISHED',
  VM_DEPLOYED = 'VM_DEPLOYED',
  FINISHED = 'FINISHED',
  ERROR = 'ERROR',
  TEMP_VM = 'TEMP_VM',
  INSTANCE_GROUP_CREATION = 'INSTANCE_GROUP_CREATION',
  INSTANCE_GROUP_CREATION_FINISHED = 'INSTANCE_GROUP_CREATION_FINISHED',
  TAG_COPYING = 'TAG_COPYING',
  TAG_COPYING_FINISHED = 'TAG_COPYING_FINISHED'
}


export interface VmDeploymentMessage {
  stage: VmDeploymentStage;

  [key: string]: any;
}

@Injectable()
export class VirtualMachineCreationEffects {
  private deploymentNotificationId: string;

  @Effect()
  initVmCreation$ = this.actions$
    .ofType(vmActions.VM_FORM_INIT)
    .switchMap((action: vmActions.VmCreationFormInit) =>
      this.resourceUsageService.getResourceUsage()
        .switchMap(resourceUsage => {
          const insufficientResources = [];

          Object.keys(resourceUsage.available)
            .filter(key => ['instances', 'volumes', 'cpus', 'memory', 'primaryStorage'].includes(key))
            .forEach(key => {
              const available = resourceUsage.available[key];
              if (available === 0) {
                insufficientResources.push(key);
              }
            });

          const enoughResources = !insufficientResources.length;

          return Observable.of(
            new vmActions.VmCreationEnoughResourceUpdateState(enoughResources),
            new vmActions.VmInitialZoneSelect());
        }));

  @Effect()
  vmSelectInitialZone$: Observable<Action> = this.actions$
    .ofType(vmActions.VM_INITIAL_ZONE_SELECT)
    .withLatestFrom(this.store.select(fromZones.selectAll).filter(zones => !!zones.length))
    .map(([action, zones]: [vmActions.VmInitialZoneSelect, Zone[]]) =>
      new vmActions.VmFormUpdate({ zone: zones[0] }));

  @Effect()
  vmCreationFormUpdate$: Observable<Action> = this.actions$
    .ofType(vmActions.VM_FORM_UPDATE)
    .filter((action: vmActions.VmFormUpdate) => !!action.payload
      && !!(action.payload.zone || action.payload.template || action.payload.diskOffering))
    .map((action: vmActions.VmFormUpdate) => {
      return new vmActions.VmFormAdjust(action.payload);
    });

  @Effect()
  vmCreationFormAdjust$: Observable<Action> = this.actions$
    .ofType(vmActions.VM_FORM_ADJUST)
    .withLatestFrom(
      this.store.select(fromVMs.getVmFormState),
      this.store.select(fromZones.selectAll),
      this.store.select(fromTemplates.selectTemplatesForVmCreation),
      this.store.select(fromServiceOfferings.getAvailableOfferingsForVmCreation),
      this.store.select(fromDiskOfferings.selectAll)
    )
    .map((
      [action, vmCreationState, zones, templates, serviceOfferings, diskOfferings]: [
        vmActions.VmFormUpdate, VmCreationState, Zone[], BaseTemplateModel[], ServiceOffering[], DiskOffering[]
        ]) => {

      if (action.payload.zone) {
        let updates = {};

        const selectedServiceOfferingStillAvailable = vmCreationState.serviceOffering
          && serviceOfferings.find(_ => _.id === vmCreationState.serviceOffering.id);
        const selectedTemplateStillAvailable = vmCreationState.template
          && templates.find(_ => _.id === vmCreationState.template.id);

        if (!selectedServiceOfferingStillAvailable) {
          updates = { ...updates, serviceOffering: serviceOfferings[0] };
        }

        if (!selectedTemplateStillAvailable) {
          updates = { ...updates, template: templates[0] };
          return new vmActions.VmFormUpdate(updates);
        }
      }

      if (action.payload.template) {
        if (action.payload.template.resourceType === TemplateResourceType.template) {
          const rootDiskSize = Utils.convertToGb(action.payload.template.size);
          return new vmActions.VmFormUpdate({ rootDiskSize });
        } else if (!vmCreationState.diskOffering) {
          return new vmActions.VmFormUpdate({ diskOffering: diskOfferings[0] });
        }
      }

      if (action.payload.diskOffering) {
        if (!action.payload.diskOffering.isCustomized || !vmCreationState.template) {
          return new vmActions.VmFormUpdate({ rootDiskMinSize: null });
        } else {
          const defaultDiskSize = this.auth.getCustomDiskOfferingMinSize() || 1;
          const minSize = Math.ceil(Utils.convertToGb(vmCreationState.template.size)) || defaultDiskSize;
          // e.g. 20000000000 B converts to 20 GB; 200000000 B -> 0.2 GB -> 1 GB; 0 B -> 1 GB
          const upd = { rootDiskMinSize: minSize };

          if (!vmCreationState.rootDiskSize
            || vmCreationState.rootDiskSize < vmCreationState.rootDiskMinSize) {
            return new vmActions.VmFormUpdate({ ...upd, rootDiskSize: minSize });
          }
          return new vmActions.VmFormUpdate(upd);
        }
      }

      if (vmCreationState.zone) {
        if (!vmCreationState.serviceOffering && serviceOfferings.length) {
          return new vmActions.VmFormUpdate({ serviceOffering: serviceOfferings[0] });
        }

        if (!vmCreationState.template && templates.length) {
          return new vmActions.VmFormUpdate({ template: templates[0] });
        }
      }

      return new vmActions.VmFormUpdate();
    });

  @Effect()
  preparingForDeploy$ = this.actions$
    .ofType(vmActions.DEPLOY_VM)
    .switchMap((action: vmActions.DeployVm) => {
      return this.templateTagService.getAgreement(action.payload.template)
        .switchMap(res => res ? this.showTemplateAgreementDialog(action.payload) : Observable.of(true))
        .filter(res => !!res)
        .switchMap(() => {
          this.deploymentNotificationId = this.jobsNotificationService.add('JOB_NOTIFICATIONS.VM.DEPLOY_IN_PROGRESS');
          this.handleDeploymentMessages({ stage: VmDeploymentStage.STARTED });

          return Observable.of<any>(
            new vmActions.DeploymentInitActionList(this.initializeDeploymentActionList(action.payload)),
            new vmActions.DeploymentRequest(action.payload)
          );
        });
    });

  @Effect()
  deploying$ = this.actions$
    .ofType(vmActions.VM_DEPLOYMENT_REQUEST)
    .switchMap((action: vmActions.DeploymentRequest) => {
      let securityGroups: SecurityGroup[];

      return this.templateTagService.getAgreement(action.payload.template)
        .switchMap(res => res ? this.showTemplateAgreementDialog(action.payload) : Observable.of(true))
        .filter(res => !!res)
        .switchMap(() => this.doCreateAffinityGroup(action.payload))
        .switchMap(() => this.doCreateSecurityGroup(action.payload)
          .map((groups) => {
            securityGroups = groups;
            this.store.dispatch(new vmActions.DeploymentChangeStatus({
              stage: VmDeploymentStage.SG_GROUP_CREATION_FINISHED
            }));
          }))
        .switchMap(() => {
          let temporaryVm;

          this.handleDeploymentMessages({ stage: VmDeploymentStage.VM_CREATION_IN_PROGRESS });
          const params = this.getVmCreationParams(action.payload, securityGroups);

          return this.vmService.deploy(params)
            .switchMap(response => this.vmService.get(response.id))
            .switchMap(vm => {
              temporaryVm = vm;

              if (action.payload.instanceGroup && action.payload.instanceGroup.name) {
                temporaryVm.instanceGroup = action.payload.instanceGroup;
              }

              this.handleDeploymentMessages({ stage: VmDeploymentStage.TEMP_VM });
              this.handleDeploymentMessages({ stage: VmDeploymentStage.VM_DEPLOYED });

              return this.vmService.incrementNumberOfVms();
            })
            .switchMap(() => this.doCreateInstanceGroup(temporaryVm, action.payload))
            .switchMap(() => this.doCopyTags(temporaryVm, action.payload))
            .map(() => new vmActions.DeploymentRequestSuccess(temporaryVm))
            .catch((error) => Observable.of(new vmActions.DeploymentRequestError(error)));
        });
    });

  @Effect({ dispatch: false })
  changeStatusOfDeployment$ = this.actions$
    .ofType(vmActions.VM_DEPLOYMENT_CHANGE_STATUS)
    .do((action: vmActions.DeploymentChangeStatus) => {
      this.handleDeploymentMessages(action.payload, this.deploymentNotificationId);
    });

  @Effect()
  deploymentError$: Observable<Action> = this.actions$
    .ofType(vmActions.VM_DEPLOYMENT_REQUEST_ERROR)
    .map((action: vmActions.DeploymentRequestError) => {
      this.jobsNotificationService.fail({
        id: this.deploymentNotificationId,
        message: 'JOB_NOTIFICATIONS.VM.DEPLOY_FAILED'
      });

      return new vmActions.DeploymentAddLoggerMessage({
        text: action.payload.params
          ? {
            translationToken: action.payload.message,
            interpolateParams: action.payload.params
          }
          : action.payload.message,
        status: [ProgressLoggerMessageStatus.ErrorMessage]
      });
    });

  constructor(
    private store: Store<State>,
    private actions$: Actions,
    private vmService: VmService,
    private jobsNotificationService: JobsNotificationService,
    private templateTagService: TemplateTagService,
    private dialog: MatDialog,
    private auth: AuthService,
    private resourceUsageService: ResourceUsageService,
    private affinityGroupService: AffinityGroupService,
    private vmCreationSecurityGroupService: VmCreationSecurityGroupService,
    private instanceGroupService: InstanceGroupService,
    private tagService: TagService,
    private userTagService: UserTagService,
    private vmTagService: VmTagService
  ) {
  }

  private handleDeploymentMessages(
    deploymentMessage: VmDeploymentMessage,
    notificationId?: string
  ): void {
    switch (deploymentMessage.stage) {
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
        this.onDeployDone(notificationId);
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

  private getDeploymentActionList(state: VmCreationState): Array<VmDeploymentStage> {
    const doCopyTags = true;

    return [
      this.createAffinityGroup(state) ? VmDeploymentStage.AG_GROUP_CREATION : null,
      this.createSecurityGroup(state) ? VmDeploymentStage.SG_GROUP_CREATION : null,
      VmDeploymentStage.VM_CREATION_IN_PROGRESS,
      this.createInstanceGroup(state) ? VmDeploymentStage.INSTANCE_GROUP_CREATION : null,
      doCopyTags ? VmDeploymentStage.TAG_COPYING : null
    ]
      .filter(_ => _);
  }

  private initializeDeploymentActionList(state: VmCreationState): ProgressLoggerMessageData[] {
    const translations = {
      [VmDeploymentStage.AG_GROUP_CREATION]: 'VM_PAGE.VM_CREATION.CREATING_AG',
      [VmDeploymentStage.SG_GROUP_CREATION]: 'VM_PAGE.VM_CREATION.CREATING_SG',
      [VmDeploymentStage.VM_CREATION_IN_PROGRESS]: 'VM_PAGE.VM_CREATION.DEPLOYING_VM',
      [VmDeploymentStage.INSTANCE_GROUP_CREATION]: 'VM_PAGE.VM_CREATION.CREATING_INSTANCE_GROUP',
      [VmDeploymentStage.TAG_COPYING]: 'VM_PAGE.VM_CREATION.TAG_COPYING'
    };

    const loggerStageList = [];

    this.getDeploymentActionList(state).forEach(actionName => {
      loggerStageList.push({ text: translations[actionName] });
    });

    return loggerStageList;
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

  private onDeployDone(notificationId: string): void {
    this.jobsNotificationService.finish({
      id: notificationId,
      message: 'JOB_NOTIFICATIONS.VM.DEPLOY_DONE'
    });
  }


  private updateLoggerMessage(
    messageText: string | ParametrizedTranslation,
    status?: Array<ProgressLoggerMessageStatus>
  ): void {
    this.store.dispatch(new vmActions.DeploymentUpdateLoggerMessage({ messageText, data: { status } }));
  }

  private showTemplateAgreementDialog(state: VmCreationState): Observable<BaseTemplateModel> {
    return this.dialog.open(VmCreationAgreementComponent, {
      width: '900px',
      data: state.template
    })
      .afterClosed();
  }

  private createAffinityGroup = (state: VmCreationState) => state.affinityGroup
    && state.affinityGroup.name && !state.affinityGroupNames.includes(state.affinityGroup.name);

  private createSecurityGroup = (state: VmCreationState) => state.zone && state.zone.securitygroupsenabled
    && state.securityGroupData.mode === VmCreationSecurityGroupMode.Builder;

  private createInstanceGroup = (state: VmCreationState) => state.instanceGroup && !!state.instanceGroup.name;

  private doCreateAffinityGroup(state: VmCreationState) {
    if (this.createAffinityGroup(state)) {
      this.handleDeploymentMessages({ stage: VmDeploymentStage.AG_GROUP_CREATION });

      return this.affinityGroupService.create({
        name: state.affinityGroup.name,
        type: AffinityGroupType.hostAntiAffinity
      })
        .map(() => this.store.dispatch(new vmActions.DeploymentChangeStatus({
          stage: VmDeploymentStage.AG_GROUP_CREATION_FINISHED
        })));
    } else {
      return Observable.of(null);
    }
  }

  private doCreateSecurityGroup(state: VmCreationState) {
    if (this.createSecurityGroup(state)) {
      this.handleDeploymentMessages({ stage: VmDeploymentStage.SG_GROUP_CREATION });

      return this.vmCreationSecurityGroupService.getSecurityGroupCreationRequest(state.securityGroupData);
    } else {
      return Observable.of(null);
    }
  }

  private doCreateInstanceGroup(vm: VirtualMachine, state: VmCreationState) {
    if (this.createInstanceGroup(state)) {
      this.handleDeploymentMessages({ stage: VmDeploymentStage.INSTANCE_GROUP_CREATION });

      return this.instanceGroupService.add(vm, state.instanceGroup)
        .map(() =>
          this.store.dispatch(new vmActions.DeploymentChangeStatus({
            stage: VmDeploymentStage.INSTANCE_GROUP_CREATION_FINISHED
          })));
    } else {
      return Observable.of(null);
    }
  }

  private doCopyTags(vm: VirtualMachine, state: VmCreationState) {
    this.handleDeploymentMessages({ stage: VmDeploymentStage.TAG_COPYING });

    return this.tagService.copyTagsToEntity(state.template.tags, vm)
      .switchMap(() => {
        return this.userTagService.getSavePasswordForAllVms();
      })
      .switchMap((tag) => {
        if (tag) {
          return this.tagService.update(
            vm,
            vm.resourceType,
            VirtualMachineTagKeys.passwordTag,
            vm.password
          );
        } else {
          return Observable.of(null);
        }
      })
      .switchMap(() => {
        if (state.agreement) {
          return this.vmTagService.setAgreement(vm);
        } else {
          return Observable.of(null);
        }
      })
      .map(() => this.store.dispatch(new vmActions.DeploymentChangeStatus({
        stage: VmDeploymentStage.TAG_COPYING_FINISHED
      })));
  }

  private getVmCreationParams(state: VmCreationState, securityGroups?: SecurityGroup[]) {
    const params: VmCreationParams = {};

    if (state.affinityGroup) {
      params.affinityGroupNames = state.affinityGroup.name;
    }

    params.startVm = state.doStartVm.toString();
    params.keyboard = state.keyboard;
    params.name = state.displayName;
    params.serviceOfferingId = state.serviceOffering.id;
    params.templateId = state.template.id;
    params.zoneId = state.zone.id;

    if (state.sshKeyPair && !(state.sshKeyPair as NotSelected).ignore) {
      params.keyPair = state.sshKeyPair.name;
    }

    if (state.diskOffering && !state.template.isTemplate) {
      params.diskofferingid = state.diskOffering.id;
      params.hypervisor = 'KVM';
    }

    console.log(securityGroups);

    if (securityGroups && securityGroups.length && securityGroups[0].id) {
      params.securityGroupIds = securityGroups.map(item => item.id).join(',');
    }

    if (state.serviceOffering.areCustomParamsSet) {
      params.details = [
        {
          cpuNumber: state.serviceOffering.cpuNumber,
          cpuSpeed: state.serviceOffering.cpuSpeed,
          memory: state.serviceOffering.memory
        }
      ];
    }

    if ((state.rootDiskSize != null && state.template.isTemplate) ||
      (state.diskOffering && state.diskOffering.isCustomized)) {
      if (state.template.isTemplate) {
        params.rootDiskSize = state.rootDiskSize;
      } else {
        params.size = state.rootDiskSize;
      }
    }

    return params;
  }
}
