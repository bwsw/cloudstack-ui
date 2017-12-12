import { Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import {
  VmDeploymentMessage,
  VmDeploymentService,
  VmDeploymentStage
} from '../../../vm/vm-creation/services/vm-deployment.service';
import { BaseTemplateModel } from '../../../template/shared';
import { DiskOffering, ServiceOffering, Zone } from '../../../shared/models';
import { Subject } from 'rxjs/Subject';
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

import * as fromZones from '../../zones/redux/zones.reducers';
import * as vmActions from './vm.actions';
import * as fromServiceOfferings from '../../service-offerings/redux/service-offerings.reducers';
import * as fromDiskOfferings from '../../disk-offerings/redux/disk-offerings.reducers';
import * as fromTemplates from '../../templates/redux/template.reducers';
import * as fromVMs from './vm.reducers';

@Injectable()
export class VirtualMachineCreationEffects {

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
  deployVm$ = this.actions$
    .ofType(vmActions.DEPLOY_VM)
    .switchMap((action: vmActions.DeployVm) => {
      return this.templateTagService.getAgreement(action.payload.state.template)
        .switchMap(res => res ? this.showTemplateAgreementDialog(action.payload.state) : Observable.of(true))
        .filter(res => !!res)
        .switchMap(() => {
          const deploymentMessageObservable = new Subject<VmDeploymentMessage>();


          // todo: !!!!!!!!
          deploymentMessageObservable
            .subscribe(message => this.store.dispatch(new vmActions.DeploymentChangeStatus(message)));

          return Observable.of(
            new vmActions.DeploymentInitActionList(this.initializeDeploymentActionList(action.payload)),
            new vmActions.DeployActionVm(deploymentMessageObservable)
          );
        });
    });

  @Effect({ dispatch: false })
  changeStatusOfDeployment$ = this.actions$
    .ofType(vmActions.VM_DEPLOYMENT_CHANGE_STATUS)
    .withLatestFrom(this.store.select(fromVMs.getVmFormState))
    .do(([action, state]: [vmActions.DeploymentChangeStatus, FormState]) => {
      const notificationId = this.jobsNotificationService.add('JOB_NOTIFICATIONS.VM.DEPLOY_IN_PROGRESS');
      this.handleDeploymentMessages(state, action.payload, notificationId);
    });

  @Effect()
  startDeployVm$ = this.actions$
    .ofType(vmActions.DEPLOY_ACTION_VM)
    .withLatestFrom(this.store.select(fromVMs.getVmFormState))
    .switchMap(([action, state]: [vmActions.DeployActionVm, FormState]) => {
      let deployedVm;
      let tempVm;
      return Observable.of(null)
        .do(() => {
          action.payload.next({
            stage: VmDeploymentStage.STARTED
          });
        })
        .switchMap(() => this.vmDeploymentService.getPreDeployActions(action.payload, state.state))
        .switchMap(modifiedState => this.vmDeploymentService.sendDeployRequest(action.payload, modifiedState))
        .switchMap(({ deployResponse, temporaryVm }) => {
          tempVm = temporaryVm;
          return this.vmService.registerVmJob(deployResponse);
        })
        .switchMap(vm => {
          deployedVm = vm;
          action.payload.next({
            stage: VmDeploymentStage.VM_DEPLOYED
          });
          return this.vmDeploymentService.getPostDeployActions(action.payload, state.state, vm);
        })
        .map(() => {
          this.vmDeploymentService.handleSuccessfulDeployment(deployedVm, action.payload);
          return new vmActions.CreateVmSuccess(deployedVm);
        })
        .catch((error) => {
          this.vmDeploymentService.handleFailedDeployment(error, tempVm, action.payload);
          return Observable.of(new vmActions.CreateVmError(error));
        });
    });

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

  constructor(
    private store: Store<State>,
    private actions$: Actions,
    private vmService: VmService,
    private jobsNotificationService: JobsNotificationService,
    private templateTagService: TemplateTagService,
    private dialog: MatDialog,
    private auth: AuthService,
    private resourceUsageService: ResourceUsageService,
    private vmDeploymentService: VmDeploymentService
  ) {
  }

  public notifyOnDeployDone(notificationId: string): void {
    this.jobsNotificationService.finish({
      id: notificationId,
      message: 'JOB_NOTIFICATIONS.VM.DEPLOY_DONE'
    });
  }

  public notifyOnDeployFailed(error: any, notificationId: string, state: FormState): void {
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
    state: FormState,
    deploymentMessage: VmDeploymentMessage,
    notificationId: string
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
      case VmDeploymentStage.ERROR:
        this.notifyOnDeployFailed(deploymentMessage.error, notificationId, state);
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
