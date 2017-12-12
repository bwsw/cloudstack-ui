import { Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import {
  VmDeploymentMessage,
  VmDeploymentService,
  VmDeploymentStage
} from '../../../vm/vm-creation/services/vm-deployment.service';
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
import { VmCreationState } from '../../../vm/vm-creation/data/vm-creation-state';
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
import { VmState } from '../../../vm/shared/vm.model';
import { InstanceGroupService } from '../../../shared/services/instance-group.service';
import { VirtualMachineTagKeys } from '../../../shared/services/tags/vm-tag-keys';
import { TagService } from '../../../shared/services/tags/tag.service';
import { UserTagService } from '../../../shared/services/tags/user-tag.service';
import { VmTagService } from '../../../shared/services/tags/vm-tag.service';

import * as fromZones from '../../zones/redux/zones.reducers';
import * as vmActions from './vm.actions';
import * as fromServiceOfferings from '../../service-offerings/redux/service-offerings.reducers';
import * as fromDiskOfferings from '../../disk-offerings/redux/disk-offerings.reducers';
import * as fromTemplates from '../../templates/redux/template.reducers';
import * as fromVMs from './vm.reducers';

@Injectable()
export class VirtualMachineCreationEffects {
  private deploymentNotificationId: string;

  @Effect()
  initVmCreation$: Observable<Action> = this.actions$
    .ofType(vmActions.VM_FORM_INIT)
    .switchMap((action: vmActions.VmCreationFormInit) => this.resourceUsageService.getResourceUsage()
      .switchMap(resourceUsage => {
        const insufficientResources = [];

        Object.keys(resourceUsage.available)
          .filter(
            key => key !== 'snapshots' && key !== 'secondaryStorage' && key !== 'ips')
          .forEach(key => {
            const available = resourceUsage.available[key];
            if (available === 0) {
              insufficientResources.push(key);
            }
          });

        const enoughResources = !insufficientResources.length;
        return Observable.of(new vmActions.VmCreationEnoughResourceUpdateState(enoughResources));
      }));

  @Effect()
  vmCreationFormUpdate$: Observable<Action> = this.actions$
    .ofType(vmActions.VM_FORM_UPDATE)
    .filter((action: vmActions.VmFormUpdate) => !!action.payload && !!Object.entries(action.payload).length)
    .withLatestFrom(
      this.store.select(fromVMs.getVmFormState),
      this.store.select(fromZones.selectAll),
      this.store.select(fromTemplates.selectTemplatesForVmCreation),
      this.store.select(fromServiceOfferings.getAvailableOfferingsForVmCreation),
      this.store.select(fromDiskOfferings.selectAll)
    )
    .map((
      [action, vmCreationState, zones, templates, serviceOfferings, diskOfferings]: [
        vmActions.VmFormUpdate, FormState, Zone[], BaseTemplateModel[], ServiceOffering[], DiskOffering[]
        ]) => {
      if (vmCreationState.state && !vmCreationState.state.zone && zones.length) {
        return new vmActions.VmFormUpdate({ zone: zones[0] });
      }

      if (!!action.payload.zone) {
        let updates = {};

        const selectedServiceOfferingStillAvailable = vmCreationState.state.serviceOffering
          && serviceOfferings.find(_ => _.id === vmCreationState.state.serviceOffering.id);
        const selectedTemplateStillAvailable = vmCreationState.state.template
          && templates.find(_ => _.id === vmCreationState.state.template.id);

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
        } else if (!vmCreationState.state.diskOffering) {
          return new vmActions.VmFormUpdate({ diskOffering: diskOfferings[0] });
        }
      }

      if (action.payload.diskOffering) {
        if (!action.payload.diskOffering.isCustomized || !vmCreationState.state.template) {
          return new vmActions.VmFormUpdate({ rootDiskMinSize: null });
        } else {
          const defaultDiskSize = this.auth.getCustomDiskOfferingMinSize() || 1;
          const minSize = Math.ceil(Utils.convertToGb(vmCreationState.state.template.size)) || defaultDiskSize;
          // e.g. 20000000000 B converts to 20 GB; 200000000 B -> 0.2 GB -> 1 GB; 0 B -> 1 GB
          const upd = { rootDiskMinSize: minSize };

          if (!vmCreationState.state.rootDiskSize
            || vmCreationState.state.rootDiskSize < vmCreationState.state.rootDiskMinSize) {
            return new vmActions.VmFormUpdate({ ...upd, rootDiskSize: minSize });
          }
          return new vmActions.VmFormUpdate(upd);
        }
      }

      if (vmCreationState.state.zone) {
        if (!vmCreationState.state.serviceOffering && serviceOfferings.length) {
          return new vmActions.VmFormUpdate({ serviceOffering: serviceOfferings[0] });
        }

        if (!vmCreationState.state.template && templates.length) {
          return new vmActions.VmFormUpdate({ template: templates[0] });
        }
      }

      return new vmActions.VmFormUpdate();
    });


  @Effect()
  preparingForDeploy$ = this.actions$
    .ofType(vmActions.DEPLOY_VM)
    .switchMap((action: vmActions.DeployVm) => {
      return this.templateTagService.getAgreement(action.payload.state.template)
        .switchMap(res => res ? this.showTemplateAgreementDialog(action.payload.state) : Observable.of(true))
        .filter(res => !!res)
        .switchMap(() => {
          this.deploymentNotificationId = this.jobsNotificationService.add('JOB_NOTIFICATIONS.VM.DEPLOY_IN_PROGRESS');

          return Observable.of(
            new vmActions.DeploymentInitActionList(this.initializeDeploymentActionList(action.payload)),
            new vmActions.DeployActionVm()
          );
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
    .ofType(vmActions.VM_DEPLOYMENT_ERROR)
    .map((action: vmActions.DeploymentError) => {
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

  @Effect()
  startDeployVm$ = this.actions$
    .ofType(vmActions.DEPLOY_ACTION_VM)
    .withLatestFrom(this.store.select(fromVMs.getVmFormState))
    .switchMap(([action, form]: [vmActions.DeployActionVm, FormState]) => {
      return Observable.of(null)
        .do(() => {
          this.handleDeploymentMessages({ stage: VmDeploymentStage.STARTED }, this.deploymentNotificationId);
        })
        .switchMap(() => Observable.of(
          new vmActions.DeploymentCreateAffinityGroup(form.state),
          new vmActions.DeploymentCreateSecurityGroup(form.state),
          new vmActions.DeploymentRequest(form.state)));
    });

  @Effect()
  deploymentCreateAffinityGroup$: Observable<Action> = this.actions$
    .ofType(vmActions.VM_DEPLOYMENT_CREATE_AFFINITY_GROUP)
    .filter((action: vmActions.DeploymentCreateAffinityGroup) => action.payload.affinityGroup
      && action.payload.affinityGroup.name
      && action.payload.affinityGroupNames.includes(action.payload.affinityGroup.name))
    .switchMap((action: vmActions.DeploymentCreateAffinityGroup) => {
      this.handleDeploymentMessages({ stage: VmDeploymentStage.AG_GROUP_CREATION }, this.deploymentNotificationId);

      return this.affinityGroupService.create({
        name: action.payload.affinityGroup.name,
        type: AffinityGroupType.hostAntiAffinity
      })
        .map(() => new vmActions.DeploymentChangeStatus({ stage: VmDeploymentStage.AG_GROUP_CREATION_FINISHED }));
    });

  @Effect()
  deploymentCreateSecurityGroup$: Observable<Action> = this.actions$
    .ofType(vmActions.VM_DEPLOYMENT_CREATE_SECURITY_GROUP)
    .filter((action: vmActions.DeploymentCreateSecurityGroup) => action.payload.zone
      && action.payload.zone.securitygroupsenabled)
    .switchMap((action: vmActions.DeploymentCreateSecurityGroup) => {
      this.handleDeploymentMessages({ stage: VmDeploymentStage.SG_GROUP_CREATION }, this.deploymentNotificationId);

      return this.vmCreationSecurityGroupService.getSecurityGroupCreationRequest(action.payload.securityGroupData)
        .map(() => new vmActions.DeploymentChangeStatus({ stage: VmDeploymentStage.SG_GROUP_CREATION_FINISHED }));
    });

  @Effect()
  requestDeployment$ = this.actions$
    .ofType(vmActions.VM_DEPLOYMENT_REQUEST)
    .switchMap((action: vmActions.DeploymentRequest) => {
      let deployResponse;
      let temporaryVm;

      this.handleDeploymentMessages({
        stage: VmDeploymentStage.VM_CREATION_IN_PROGRESS
      }, this.deploymentNotificationId);
      const params = this.vmDeploymentService.getVmCreationParams(action.payload);

      return this.vmService.deploy(params)
        .switchMap(response => {
          deployResponse = response;
          return this.vmService.get(deployResponse.id);
        })
        .switchMap(vm => {
          temporaryVm = vm;
          temporaryVm.state = VmState.Deploying;
          this.handleDeploymentMessages({ stage: VmDeploymentStage.TEMP_VM }, this.deploymentNotificationId);
          return this.vmService.incrementNumberOfVms();
        })
        .switchMap(() => Observable.of(
          new vmActions.DeploymentChangeStatus({ stage: VmDeploymentStage.VM_DEPLOYED }),
          new vmActions.DeploymentResponse({ deployResponse, temporaryVm })))
        .catch((error) => Observable.of(new vmActions.DeploymentError(error)));
    });

  @Effect()
  postDeployActions$ = this.actions$
    .ofType(vmActions.VM_DEPLOYMENT_RESPONSE)
    .withLatestFrom(this.store.select(fromVMs.getVmFormState))
    .switchMap(([action, form]: [vmActions.DeploymentResponse, FormState]) => Observable.of(
      new vmActions.DeploymentCreateInstanceGroup({ state: form.state, vm: action.payload.temporaryVm }),
      new vmActions.DeploymentCopyTags({ state: form.state, vm: action.payload.temporaryVm })));

  @Effect()
  deploymentCreateInstanceGroup$: Observable<Action> = this.actions$
    .ofType(vmActions.VM_DEPLOYMENT_CREATE_INSTANCE_GROUP)
    .filter((action: vmActions.DeploymentCreateInstanceGroup) => action.payload.state.instanceGroup
      && action.payload.state.instanceGroup.name)
    .switchMap((action: vmActions.DeploymentCreateInstanceGroup) => {
      this.handleDeploymentMessages({
        stage: VmDeploymentStage.INSTANCE_GROUP_CREATION
      }, this.deploymentNotificationId);

      return this.instanceGroupService.add(action.payload.vm, action.payload.state.instanceGroup)
        .map(() => new vmActions.DeploymentChangeStatus({ stage: VmDeploymentStage.INSTANCE_GROUP_CREATION_FINISHED }));
    });

  @Effect()
  deploymentCopyTags$: Observable<Action> = this.actions$
    .ofType(vmActions.VM_DEPLOYMENT_COPY_TAGS)
    .switchMap((action: vmActions.DeploymentCopyTags) => {
      this.handleDeploymentMessages({
        stage: VmDeploymentStage.TAG_COPYING
      }, this.deploymentNotificationId);

      return this.tagService.copyTagsToEntity(action.payload.state.template.tags, action.payload.vm)
        .switchMap(() => {
          return this.userTagService.getSavePasswordForAllVms();
        })
        .switchMap((tag) => {
          if (tag) {
            return this.tagService.update(
              action.payload.vm,
              action.payload.vm.resourceType,
              VirtualMachineTagKeys.passwordTag,
              action.payload.vm.password
            );
          } else {
            return Observable.of(null);
          }
        })
        .switchMap(() => {
          if (action.payload.state.agreement) {
            return this.vmTagService.setAgreement(action.payload.vm);
          } else {
            return Observable.of(null);
          }
        })
        .map(() => new vmActions.DeploymentChangeStatus({ stage: VmDeploymentStage.TAG_COPYING_FINISHED }));
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
    private vmDeploymentService: VmDeploymentService,
    private affinityGroupService: AffinityGroupService,
    private vmCreationSecurityGroupService: VmCreationSecurityGroupService,
    private instanceGroupService: InstanceGroupService,
    private tagService: TagService,
    private userTagService: UserTagService,
    private vmTagService: VmTagService
  ) {
  }

  public notifyOnDeployDone(notificationId: string): void {
    this.jobsNotificationService.finish({
      id: notificationId,
      message: 'JOB_NOTIFICATIONS.VM.DEPLOY_DONE'
    });
  }

  public notifyOnDeployFailed(error: any, notificationId: string, state?: FormState): void {
    this.store.dispatch(new vmActions.DeploymentAddLoggerMessage({
      text: error.params
        ? {
          translationToken: error.message,
          interpolateParams: error.params
        }
        : error.message,
      status: [ProgressLoggerMessageStatus.ErrorMessage]
    }));

    const inProgressMessage = state.loggerStageList.find(message => {
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
        this.onVmDeploymentFinished(notificationId);
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
    const doCreateAffinityGroup = state.affinityGroup && state.affinityGroup.name
      && !state.affinityGroupNames.includes(state.affinityGroup.name);
    const securityGroupsAreAllowed = state.zone && state.zone.securitygroupsenabled;
    const doCreateInstanceGroup = state.instanceGroup && state.instanceGroup.name;
    const doCopyTags = true;

    return [
      doCreateAffinityGroup ? VmDeploymentStage.AG_GROUP_CREATION : null,
      securityGroupsAreAllowed ? VmDeploymentStage.SG_GROUP_CREATION : null,
      VmDeploymentStage.VM_CREATION_IN_PROGRESS,
      doCreateInstanceGroup ? VmDeploymentStage.INSTANCE_GROUP_CREATION : null,
      doCopyTags ? VmDeploymentStage.TAG_COPYING : null
    ]
      .filter(_ => _);
  }

  private initializeDeploymentActionList(state: FormState): ProgressLoggerMessageData[] {
    const translations = {
      'AG_GROUP_CREATION': 'VM_PAGE.VM_CREATION.CREATING_AG',
      'SG_GROUP_CREATION': 'VM_PAGE.VM_CREATION.CREATING_SG',
      'VM_CREATION_IN_PROGRESS': 'VM_PAGE.VM_CREATION.DEPLOYING_VM',
      'INSTANCE_GROUP_CREATION': 'VM_PAGE.VM_CREATION.CREATING_INSTANCE_GROUP',
      'TAG_COPYING': 'VM_PAGE.VM_CREATION.TAG_COPYING'
    };

    const loggerStageList = [];

    this.getDeploymentActionList(state.state).forEach(actionName => {
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

  private onVmDeploymentFinished(notificationId: string): void {
    this.notifyOnDeployDone(notificationId);
  }

  private updateLoggerMessage(
    messageText: string | ParametrizedTranslation,
    status?: Array<ProgressLoggerMessageStatus>
  ): void {
    // todo: ???
    this.store.dispatch(new vmActions.DeploymentUpdateLoggerMessage({ messageText, data: { status } }));
  }

  private showTemplateAgreementDialog(state: VmCreationState): Observable<BaseTemplateModel> {
    return this.dialog.open(VmCreationAgreementComponent, {
      width: '900px',
      data: state.template
    })
      .afterClosed();
  }
}
