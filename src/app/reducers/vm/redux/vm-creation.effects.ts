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
        vmActions.VmFormUpdate, FormState, Zone[], BaseTemplateModel[], ServiceOffering[], DiskOffering[]
        ]) => {

      if (action.payload.zone) {
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
          this.handleDeploymentMessages({ stage: VmDeploymentStage.STARTED });

          return Observable.of(
            new vmActions.DeploymentInitActionList(this.initializeDeploymentActionList(action.payload)),
            new vmActions.PrepareForDeployment(),
            new vmActions.DeploymentRequest()
          );
        });
    });

  @Effect()
  deploymentCreateAffinityGroup$: Observable<Action> = this.actions$
    .ofType(vmActions.VM_PREPARE_FOR_DEPLOYMENT)
    .withLatestFrom(this.store.select(fromVMs.getVmFormState))
    .filter(([action, form]: [vmActions.PrepareForDeployment, FormState]) => form.state.affinityGroup
      && form.state.affinityGroup.name && !form.state.affinityGroupNames.includes(form.state.affinityGroup.name))
    .switchMap(([action, form]: [vmActions.PrepareForDeployment, FormState]) => {
      this.handleDeploymentMessages({ stage: VmDeploymentStage.AG_GROUP_CREATION });

      return this.affinityGroupService.create({
        name: form.state.affinityGroup.name,
        type: AffinityGroupType.hostAntiAffinity
      })
        .map(() => new vmActions.DeploymentChangeStatus({ stage: VmDeploymentStage.AG_GROUP_CREATION_FINISHED }));
    });

  @Effect()
  deploymentCreateSecurityGroup$: Observable<Action> = this.actions$
    .ofType(vmActions.VM_PREPARE_FOR_DEPLOYMENT)
    .withLatestFrom(this.store.select(fromVMs.getVmFormState))
    .filter(([action, form]: [vmActions.PrepareForDeployment, FormState]) => form.state.zone
      && form.state.zone.securitygroupsenabled)
    .switchMap(([action, form]: [vmActions.PrepareForDeployment, FormState]) => {
      this.handleDeploymentMessages({ stage: VmDeploymentStage.SG_GROUP_CREATION }, this.deploymentNotificationId);

      return this.vmCreationSecurityGroupService.getSecurityGroupCreationRequest(form.state.securityGroupData)
        .map(() => new vmActions.DeploymentChangeStatus({ stage: VmDeploymentStage.SG_GROUP_CREATION_FINISHED }));
    });

  @Effect()
  requestDeployment$: any = this.actions$
    .ofType(vmActions.VM_DEPLOYMENT_REQUEST)
    .withLatestFrom(this.store.select(fromVMs.getVmFormState))
    .switchMap(([action, form]: [vmActions.DeploymentRequest, FormState]) => {
      let temporaryVm;

      this.handleDeploymentMessages({ stage: VmDeploymentStage.VM_CREATION_IN_PROGRESS });
      const params = this.vmDeploymentService.getVmCreationParams(form.state);

      return this.vmService.deploy(params)
        .switchMap(response => this.vmService.get(response.id))
        .switchMap(vm => {
          temporaryVm = vm;

          if (form.state.instanceGroup && form.state.instanceGroup.name) {
            temporaryVm.instanceGroup = form.state.instanceGroup;
          }

          this.handleDeploymentMessages({ stage: VmDeploymentStage.TEMP_VM }, this.deploymentNotificationId);
          return this.vmService.incrementNumberOfVms();
        })
        .switchMap(() => Observable.of<any>(
          new vmActions.CreateVm(temporaryVm),
          new vmActions.CreateVmSuccess(temporaryVm),
          new vmActions.DeploymentChangeStatus({ stage: VmDeploymentStage.VM_DEPLOYED })
        ))
        .catch((error) => Observable.of(new vmActions.DeploymentError(error)));
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
  deploymentCreateInstanceGroup$ = this.actions$
    .ofType(vmActions.CREATE_VM)
    .withLatestFrom(this.store.select(fromVMs.getVmFormState))
    .filter(([action, form]: [vmActions.CreateVm, FormState]) =>
      form.state.instanceGroup && !!form.state.instanceGroup.name)
    .switchMap(([action, form]: [vmActions.CreateVm, FormState]) => {
      this.handleDeploymentMessages({ stage: VmDeploymentStage.INSTANCE_GROUP_CREATION });

      return this.instanceGroupService.add(action.payload, form.state.instanceGroup)
        .map((vm) =>
          new vmActions.DeploymentChangeStatus({ stage: VmDeploymentStage.INSTANCE_GROUP_CREATION_FINISHED }));
    });

  @Effect()
  deploymentCopyTags$: Observable<Action> = this.actions$
    .ofType(vmActions.CREATE_VM)
    .withLatestFrom(this.store.select(fromVMs.getVmFormState))
    .switchMap(([action, form]: [vmActions.CreateVm, FormState]) => {
      this.handleDeploymentMessages({
        stage: VmDeploymentStage.TAG_COPYING
      }, this.deploymentNotificationId);

      return this.tagService.copyTagsToEntity(form.state.template.tags, action.payload)
        .switchMap(() => {
          return this.userTagService.getSavePasswordForAllVms();
        })
        .switchMap((tag) => {
          if (tag) {
            return this.tagService.update(
              action.payload,
              action.payload.resourceType,
              VirtualMachineTagKeys.passwordTag,
              action.payload.password
            );
          } else {
            return Observable.of(null);
          }
        })
        .switchMap(() => {
          if (form.state.agreement) {
            return this.vmTagService.setAgreement(action.payload);
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
      [VmDeploymentStage.AG_GROUP_CREATION]: 'VM_PAGE.VM_CREATION.CREATING_AG',
      [VmDeploymentStage.SG_GROUP_CREATION]: 'VM_PAGE.VM_CREATION.CREATING_SG',
      [VmDeploymentStage.VM_CREATION_IN_PROGRESS]: 'VM_PAGE.VM_CREATION.DEPLOYING_VM',
      [VmDeploymentStage.INSTANCE_GROUP_CREATION]: 'VM_PAGE.VM_CREATION.CREATING_INSTANCE_GROUP',
      [VmDeploymentStage.TAG_COPYING]: 'VM_PAGE.VM_CREATION.TAG_COPYING'
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

  public onDeployDone(notificationId: string): void {
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
}
