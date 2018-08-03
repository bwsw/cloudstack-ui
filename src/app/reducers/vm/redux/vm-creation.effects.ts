import { Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { Rules } from '../../../shared/components/security-group-builder/rules';
import { BaseTemplateModel } from '../../../template/shared';
import { AffinityGroupType, DiskOffering, ServiceOffering, Zone } from '../../../shared/models';
import { Observable } from 'rxjs/Observable';
import { TemplateResourceType } from '../../../template/shared/base-template.service';
import { Actions, Effect } from '@ngrx/effects';
import { MatDialog } from '@angular/material';

import { Utils } from '../../../shared/services/utils/utils.service';
import { DialogService, ParametrizedTranslation } from '../../../dialog/dialog-service/dialog.service';
import {
  ProgressLoggerMessageData,
  ProgressLoggerMessageStatus
} from '../../../shared/components/progress-logger/progress-logger-message/progress-logger-message';
import { NotSelected, VmCreationState } from '../../../vm/vm-creation/data/vm-creation-state';
import { VmCreationSecurityGroupData } from '../../../vm/vm-creation/security-group/vm-creation-security-group-data';
// tslint:disable-next-line
import { VmCreationAgreementComponent } from '../../../vm/vm-creation/template/agreement/vm-creation-agreement.component';
import { VmService } from '../../../vm/shared/vm.service';
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
import { VmTagService } from '../../../shared/services/tags/vm-tag.service';
import { NetworkRule } from '../../../security-group/network-rule.model';
import { VmCreationSecurityGroupMode } from '../../../vm/vm-creation/security-group/vm-creation-security-group-mode';
import { SecurityGroup } from '../../../security-group/sg.model';
import { VirtualMachine, VmResourceType, VmState } from '../../../vm/shared/vm.model';
import { SnackBarService } from '../../../core/services';

import * as fromZones from '../../zones/redux/zones.reducers';
import * as vmActions from './vm.actions';
import * as securityGroupActions from '../../security-groups/redux/sg.actions';
import * as fromServiceOfferings from '../../service-offerings/redux/service-offerings.reducers';
import * as fromDiskOfferings from '../../disk-offerings/redux/disk-offerings.reducers';
import * as fromSecurityGroups from '../../security-groups/redux/sg.reducers';
import * as fromTemplates from '../../templates/redux/template.reducers';
import * as fromVMs from './vm.reducers';
import { UserTagsActions, UserTagsSelectors } from '../../../root-store';

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
            .filter(key => ['instances', 'volumes', 'cpus', 'memory', 'primaryStorage'].indexOf(key) !== -1)
            .forEach(key => {
              const available = resourceUsage.available[key];
              if (available === 0) {
                insufficientResources.push(key);
              }
            });

          const enoughResources = !insufficientResources.length;

          return Observable.of(
            new vmActions.VmCreationEnoughResourceUpdateState(enoughResources),
            new vmActions.VmInitialZoneSelect(),
            new vmActions.VmInitialSecurityGroupsSelect()
          );
        }));

  @Effect()
  vmSelectInitialZone$: Observable<Action> = this.actions$
    .ofType(vmActions.VM_INITIAL_ZONE_SELECT)
    .withLatestFrom(this.store.select(fromZones.selectAll).filter(zones => !!zones.length))
    .map(([action, zones]: [vmActions.VmInitialZoneSelect, Zone[]]) =>
      new vmActions.VmFormUpdate({ zone: zones[0] }));

  @Effect()
  vmSelectPredefinedSecurityGroups$: Observable<Action> = this.actions$
    .ofType(vmActions.VM_SECURITY_GROUPS_SELECT)
    .withLatestFrom(this.store.select(fromSecurityGroups.selectPredefinedSecurityGroups)
      .filter(groups => !!groups.length))
    .map(([action, securityGroups]: [vmActions.VmInitialSecurityGroupsSelect, SecurityGroup[]]) => {
      return new vmActions.VmFormUpdate({
        securityGroupData: VmCreationSecurityGroupData
          .fromRules(Rules.createWithAllRulesSelected(securityGroups))
      });
    });

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
      this.store.select(fromTemplates.selectFilteredTemplatesForVmCreation),
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
        if (action.payload.template.resourceType !== TemplateResourceType.template && !vmCreationState.diskOffering) {
          return new vmActions.VmFormUpdate({ diskOffering: diskOfferings[0] });
        }
      }

      if (action.payload.diskOffering) {
        if (!action.payload.diskOffering.iscustomized || !vmCreationState.template) {
          return new vmActions.VmFormUpdate({ rootDiskMinSize: null });
        } else {
          const defaultDiskSize = this.auth.getCustomDiskOfferingMinSize() || 1;
          const minSize = Math.max(Math.ceil(Utils.convertToGb(vmCreationState.template.size)), defaultDiskSize);
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
        .switchMap(res => res ? this.showTemplateAgreementDialog(action.payload) : Observable.of({}))
        .switchMap((agreement) => {
          if (agreement) {
            this.deploymentNotificationId = this.jobsNotificationService.add('NOTIFICATIONS.VM.DEPLOY_IN_PROGRESS');
            this.handleDeploymentMessages({ stage: VmDeploymentStage.STARTED });

            return Observable.of<any>(
              new vmActions.DeploymentInitActionList(this.initializeDeploymentActionList(action.payload)),
              new vmActions.DeploymentRequest(action.payload)
            );
          } else {
            return Observable.of(new vmActions.VmCreationStateUpdate({
              showOverlay: false,
              deploymentInProgress: false
            }));
          }
        });
    });

  @Effect()
  deploying$ = this.actions$
    .ofType(vmActions.VM_DEPLOYMENT_REQUEST)
    .switchMap((action: vmActions.DeploymentRequest) => {
      return this.doCreateAffinityGroup(action.payload)
        .switchMap(() => this.doCreateSecurityGroup(action.payload)
          .switchMap((securityGroups) => {
            if (action.payload.securityGroupData.mode === VmCreationSecurityGroupMode.Builder) {
              this.store.dispatch(new securityGroupActions.CreateSecurityGroupsSuccess(securityGroups));
            }
            this.store.dispatch(new vmActions.DeploymentChangeStatus({
              stage: VmDeploymentStage.SG_GROUP_CREATION_FINISHED
            }));

            this.handleDeploymentMessages({ stage: VmDeploymentStage.VM_CREATION_IN_PROGRESS });
            const params = this.getVmCreationParams(action.payload, securityGroups);
            let deployResponse;

            return this.vmService.deploy(params)
              .switchMap(response => {
                deployResponse = response;
                return this.vmService.get(deployResponse.id);
              })
              .switchMap(vm => {
                const temporaryVm = vm;

                if (action.payload.instanceGroup && action.payload.instanceGroup.name) {
                  temporaryVm.instanceGroup = action.payload.instanceGroup;
                }

                temporaryVm.state = VmState.Deploying;
                this.handleDeploymentMessages({ stage: VmDeploymentStage.TEMP_VM });

                this.store.dispatch(new UserTagsActions.IncrementLastVMId());
                return this.vmService.registerVmJob(deployResponse);
              })
              .switchMap((deployedVm: VirtualMachine) => {
                this.handleDeploymentMessages({ stage: VmDeploymentStage.VM_DEPLOYED });

                return this.doCreateInstanceGroup(deployedVm, action.payload)
                  .switchMap((virtualMachine) => this.doCopyTags(virtualMachine, action.payload));
              })
              .map((vmWithTags) => {
                if (action.payload.doStartVm) {
                  vmWithTags.state = VmState.Running;
                }
                return new vmActions.DeploymentRequestSuccess(vmWithTags);
              })
              .catch((error) => Observable.of(new vmActions.DeploymentRequestError(error)));
          })
          .catch((error) => Observable.of(new vmActions.DeploymentRequestError(error))));
    });

  @Effect({ dispatch: false })
  changeStatusOfDeployment$ = this.actions$
    .ofType(vmActions.VM_DEPLOYMENT_CHANGE_STATUS)
    .do((action: vmActions.DeploymentChangeStatus) => {
      this.handleDeploymentMessages(action.payload);
    });

  @Effect({ dispatch: false })
  deploymentSuccess$ = this.actions$
    .ofType(vmActions.VM_DEPLOYMENT_REQUEST_SUCCESS)
    .do((action: vmActions.DeploymentRequestSuccess) => {
      this.handleDeploymentMessages({ stage: VmDeploymentStage.FINISHED });
    });

  @Effect()
  deploymentError$: Observable<Action> = this.actions$
    .ofType(vmActions.VM_DEPLOYMENT_REQUEST_ERROR)
    .map((action: vmActions.DeploymentRequestError) => {
      const message = 'NOTIFICATIONS.VM.DEPLOY_FAILED';
      this.jobsNotificationService.fail({
        id: this.deploymentNotificationId,
        message
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
    private dialogService: DialogService,
    private dialog: MatDialog,
    private auth: AuthService,
    private resourceUsageService: ResourceUsageService,
    private affinityGroupService: AffinityGroupService,
    private vmCreationSecurityGroupService: VmCreationSecurityGroupService,
    private instanceGroupService: InstanceGroupService,
    private tagService: TagService,
    private vmTagService: VmTagService,
    private snackBar: SnackBarService
  ) {
  }

  private handleDeploymentMessages(
    deploymentMessage: VmDeploymentMessage,
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
        this.onDeployDone();
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

  private onDeployDone(): void {
    const message = 'NOTIFICATIONS.VM.DEPLOY_DONE';
    this.jobsNotificationService.finish({
      id: this.deploymentNotificationId,
      message
    });
    this.snackBar.open(message).subscribe();
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
    && state.affinityGroup.name && !state.affinityGroupNames
      .map(name => name.toUpperCase())
      .includes(state.affinityGroup.name.toUpperCase());

  private createSecurityGroup = (state: VmCreationState) => state.zone && state.zone.securitygroupsenabled
    && state.securityGroupData.mode === VmCreationSecurityGroupMode.Builder
    && !!state.securityGroupData.rules.templates.length;

  private createInstanceGroup = (state: VmCreationState) => state.instanceGroup && !!state.instanceGroup.name;

  private doCreateAffinityGroup(state: VmCreationState) {
    if (this.createAffinityGroup(state)) {
      this.handleDeploymentMessages({ stage: VmDeploymentStage.AG_GROUP_CREATION });

      return this.affinityGroupService.create({
        name: state.affinityGroup.name,
        type: AffinityGroupType.hostAntiAffinity
      })
        .map(() => {
          this.store.dispatch(new vmActions.DeploymentChangeStatus({
            stage: VmDeploymentStage.AG_GROUP_CREATION_FINISHED
          }));
          this.store.dispatch(new vmActions.VmFormUpdate({
            affinityGroupNames: [...state.affinityGroupNames, state.affinityGroup.name]
          }));
        })
        .catch((error) => Observable.of(new vmActions.DeploymentRequestError(error)));
    } else {
      return Observable.of(null);
    }
  }

  private doCreateSecurityGroup(state: VmCreationState) {
    if (this.createSecurityGroup(state)) {
      this.handleDeploymentMessages({ stage: VmDeploymentStage.SG_GROUP_CREATION });

      return this.vmCreationSecurityGroupService.getSecurityGroupCreationRequest(state);
    } else {
      return Observable.of(state.securityGroupData.securityGroups);
    }
  }

  private doCreateInstanceGroup(vm: VirtualMachine, state: VmCreationState) {
    if (this.createInstanceGroup(state)) {
      this.handleDeploymentMessages({ stage: VmDeploymentStage.INSTANCE_GROUP_CREATION });

      return this.instanceGroupService.add(vm, state.instanceGroup)
        .map((virtualMachine: VirtualMachine) => {
          this.store.dispatch(new vmActions.DeploymentChangeStatus({
            stage: VmDeploymentStage.INSTANCE_GROUP_CREATION_FINISHED
          }));
          return virtualMachine;
        });
    } else {
      return Observable.of(vm);
    }
  }

  private doCopyTags(vm: VirtualMachine, state: VmCreationState): Observable<VirtualMachine> {
    this.handleDeploymentMessages({ stage: VmDeploymentStage.TAG_COPYING });
    return this.vmTagService.copyTagsToEntity(state.template.tags, vm)
      .switchMap(() => this.store.select(UserTagsSelectors.getIsSavePasswordForVMs))
      .switchMap((tag) => {
        if (tag && vm.password) {
          return this.tagService.update(
            vm,
            VmResourceType,
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
      .map(() => {
        this.store.dispatch(new vmActions.DeploymentChangeStatus({
          stage: VmDeploymentStage.TAG_COPYING_FINISHED
        }));
        return <VirtualMachine>({ ...vm, tags: [...vm.tags] });
      });
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

    if (securityGroups && securityGroups.length && securityGroups[0].id) {
      params.securityGroupIds = securityGroups.map(item => item.id).join(',');
    }

    if (state.serviceOffering.iscustomized) {
      params.details = [
        {
          cpuNumber: state.serviceOffering.cpunumber,
          cpuSpeed: state.serviceOffering.cpuspeed,
          memory: state.serviceOffering.memory
        }
      ];
    }

    if ((state.rootDiskSize != null && state.template.isTemplate) ||
      (state.diskOffering && state.diskOffering.iscustomized)) {
      if (state.template.isTemplate) {
        params.rootDiskSize = state.rootDiskSize;
      } else {
        params.size = state.rootDiskSize;
      }
    }

    return params;
  }
}
