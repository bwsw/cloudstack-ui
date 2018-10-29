import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Action, select, Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, filter, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';

import { Utils } from '../../../shared/services/utils/utils.service';
import { ParametrizedTranslation } from '../../../dialog/dialog-service/dialog.service';
import {
  ProgressLoggerMessageData,
  ProgressLoggerMessageStatus,
} from '../../../shared/components/progress-logger/progress-logger-message/progress-logger-message';
import { BaseTemplateModel, isTemplate } from '../../../template/shared';
import { DiskOffering, Zone } from '../../../shared/models';
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
import { VmCreationSecurityGroupService } from '../../../vm/vm-creation/services/vm-creation-security-group.service';
import { InstanceGroupService } from '../../../shared/services/instance-group.service';
import { VmTagService } from '../../../shared/services/tags/vm-tag.service';
import { NetworkRule } from '../../../security-group/network-rule.model';
import { VmCreationSecurityGroupMode } from '../../../vm/vm-creation/security-group/vm-creation-security-group-mode';
import { SecurityGroup } from '../../../security-group/sg.model';
import { VirtualMachine, VmState } from '../../../vm/shared/vm.model';
import { SnackBarService } from '../../../core/services';
import { configSelectors, UserTagsActions, UserTagsSelectors } from '../../../root-store';
import { DefaultComputeOffering } from '../../../shared/models/config';

import * as fromZones from '../../zones/redux/zones.reducers';
import * as vmActions from './vm.actions';
import * as securityGroupActions from '../../security-groups/redux/sg.actions';
import * as fromDiskOfferings from '../../disk-offerings/redux/disk-offerings.reducers';
import * as fromSecurityGroups from '../../security-groups/redux/sg.reducers';
import * as fromTemplates from '../../templates/redux/template.reducers';
import * as fromVMs from './vm.reducers';
import * as fromVMModule from '../../../vm/selectors';
import { KeyboardLayout } from '../../../shared/types';
import { ComputeOfferingViewModel } from '../../../vm/view-models';

interface VmCreationParams {
  affinityGroupNames?: string;
  details?: any[];
  diskofferingid?: string;
  startVm?: string;
  hypervisor?: string;
  ingress?: NetworkRule[];
  egress?: NetworkRule[];
  keyboard?: KeyboardLayout;
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
  SG_GROUP_CREATION = 'SG_GROUP_CREATION',
  SG_GROUP_CREATION_FINISHED = 'SG_GROUP_CREATION_FINISHED',
  VM_DEPLOYED = 'VM_DEPLOYED',
  FINISHED = 'FINISHED',
  ERROR = 'ERROR',
  TEMP_VM = 'TEMP_VM',
  INSTANCE_GROUP_CREATION = 'INSTANCE_GROUP_CREATION',
  INSTANCE_GROUP_CREATION_FINISHED = 'INSTANCE_GROUP_CREATION_FINISHED',
  TAG_COPYING = 'TAG_COPYING',
  TAG_COPYING_FINISHED = 'TAG_COPYING_FINISHED',
}

export interface VmDeploymentMessage {
  stage: VmDeploymentStage;

  [key: string]: any;
}

@Injectable()
export class VirtualMachineCreationEffects {
  @Effect()
  initVmCreation$ = this.actions$.pipe(
    ofType(vmActions.VM_FORM_INIT),
    switchMap((action: vmActions.VmCreationFormInit) =>
      this.resourceUsageService.getResourceUsage().pipe(
        switchMap(resourceUsage => {
          const insufficientResources = [];

          Object.keys(resourceUsage.available)
            .filter(
              key =>
                ['instances', 'volumes', 'cpus', 'memory', 'primaryStorage'].indexOf(key) !== -1,
            )
            .forEach(key => {
              const available = resourceUsage.available[key];
              if (available === 0) {
                insufficientResources.push(key);
              }
            });

          const enoughResources = !insufficientResources.length;

          return of(
            new vmActions.VmCreationEnoughResourceUpdateState(enoughResources),
            new vmActions.VmInitialZoneSelect(),
            new vmActions.VmInitialSecurityGroupsSelect(),
          );
        }),
      ),
    ),
  );

  @Effect()
  vmSelectInitialZone$: Observable<Action> = this.actions$.pipe(
    ofType(vmActions.VM_INITIAL_ZONE_SELECT),
    withLatestFrom(
      this.store.pipe(
        select(fromZones.selectAll),
        filter(zones => !!zones.length),
      ),
    ),
    map(
      ([action, zones]: [vmActions.VmInitialZoneSelect, Zone[]]) =>
        new vmActions.VmFormUpdate({ zone: zones[0] }),
    ),
  );

  @Effect()
  vmSelectPredefinedSecurityGroups$: Observable<Action> = this.actions$.pipe(
    ofType(vmActions.VM_SECURITY_GROUPS_SELECT),
    withLatestFrom(
      this.store.pipe(
        select(fromSecurityGroups.selectPredefinedSecurityGroups),
        filter(groups => !!groups.length),
      ),
      this.store.pipe(select(fromSecurityGroups.selectDefaultSecurityGroup)),
    ),
    map(
      ([action, securityGroups, defaultSecurityGroup]: [
        vmActions.VmInitialSecurityGroupsSelect,
        SecurityGroup[],
        SecurityGroup
      ]) => {
        return new vmActions.VmFormUpdate({
          securityGroupData: VmCreationSecurityGroupData.fromSecurityGroup([defaultSecurityGroup]),
        });
      },
    ),
  );

  @Effect()
  vmCreationFormUpdate$: Observable<Action> = this.actions$.pipe(
    ofType(vmActions.VM_FORM_UPDATE),
    filter(
      (action: vmActions.VmFormUpdate) =>
        !!action.payload &&
        !!(action.payload.zone || action.payload.template || action.payload.diskOffering),
    ),
    map((action: vmActions.VmFormUpdate) => {
      return new vmActions.VmFormAdjust(action.payload);
    }),
  );

  // tslint:disable:cyclomatic-complexity
  @Effect()
  vmCreationFormAdjust$: Observable<Action> = this.actions$.pipe(
    ofType(vmActions.VM_FORM_ADJUST),
    withLatestFrom(
      this.store.pipe(select(fromVMs.getVmFormState)),
      this.store.pipe(select(fromZones.selectAll)),
      this.store.pipe(select(fromTemplates.selectFilteredTemplatesForVmCreation)),
      this.store.pipe(select(fromVMModule.getAvailableOfferingsForVmCreation)),
      this.store.pipe(select(fromDiskOfferings.selectAll)),
      this.store.pipe(select(configSelectors.get('defaultComputeOffering'))),
    ),
    map(
      ([
        action,
        vmCreationState,
        zones,
        templates,
        serviceOfferings,
        diskOfferings,
        defaultComputeOfferings,
      ]: [
        vmActions.VmFormUpdate,
        VmCreationState,
        Zone[],
        BaseTemplateModel[],
        ComputeOfferingViewModel[],
        DiskOffering[],
        DefaultComputeOffering[]
      ]) => {
        if (action.payload.zone) {
          let updates = {};

          const selectedServiceOfferingStillAvailable =
            vmCreationState.serviceOffering &&
            serviceOfferings.find(_ => _.id === vmCreationState.serviceOffering.id);
          const selectedTemplateStillAvailable =
            vmCreationState.template && templates.find(_ => _.id === vmCreationState.template.id);

          if (!selectedServiceOfferingStillAvailable) {
            const offering = this.getPreselectedOffering(
              serviceOfferings,
              vmCreationState.zone,
              defaultComputeOfferings,
            );

            updates = { ...updates, serviceOffering: offering };
          }

          if (!selectedTemplateStillAvailable) {
            updates = { ...updates, template: templates[0] };
            return new vmActions.VmFormUpdate(updates);
          }
        }

        if (action.payload.template) {
          if (!isTemplate(action.payload.template) && !vmCreationState.diskOffering) {
            return new vmActions.VmFormUpdate({ diskOffering: diskOfferings[0] });
          }

          if (isTemplate(action.payload.template)) {
            const defaultDiskSize = this.auth.getCustomDiskOfferingMinSize() || 1;
            // e.g. 20000000000 B converts to 20 GB; 200000000 B -> 0.2 GB -> 1 GB; 0 B -> 1 GB
            const minSize =
              Math.ceil(Utils.convertToGb(vmCreationState.template.size)) || defaultDiskSize;
            const upd = { rootDiskMinSize: minSize };
            return new vmActions.VmFormUpdate({ ...upd, rootDiskSize: minSize });
          }
        }

        if (action.payload.diskOffering) {
          if (action.payload.diskOffering.iscustomized) {
            const minSize = this.auth.getCustomDiskOfferingMinSize() || 10;
            return new vmActions.VmFormUpdate({ rootDiskMinSize: minSize, rootDiskSize: minSize });
          }

          if (!action.payload.diskOffering.iscustomized || !vmCreationState.template) {
            return new vmActions.VmFormUpdate({ rootDiskMinSize: null });
          }
        }

        if (vmCreationState.zone) {
          if (!vmCreationState.serviceOffering && serviceOfferings.length) {
            const offering = this.getPreselectedOffering(
              serviceOfferings,
              vmCreationState.zone,
              defaultComputeOfferings,
            );

            return new vmActions.VmFormUpdate({ serviceOffering: offering });
          }

          if (!vmCreationState.template && templates.length) {
            return new vmActions.VmFormUpdate({ template: templates[0] });
          }
        }

        return new vmActions.VmFormUpdate();
      },
    ),
  );
  // tslint:enable:cyclomatic-complexity

  @Effect()
  preparingForDeploy$ = this.actions$.pipe(
    ofType(vmActions.DEPLOY_VM),
    switchMap((action: vmActions.DeployVm) => {
      return this.templateTagService.getAgreement(action.payload.template).pipe(
        switchMap(res => (res ? this.showTemplateAgreementDialog(action.payload) : of({}))),
        switchMap(agreement => {
          if (agreement) {
            this.deploymentNotificationId = this.jobsNotificationService.add(
              'NOTIFICATIONS.VM.DEPLOY_IN_PROGRESS',
            );
            this.handleDeploymentMessages({ stage: VmDeploymentStage.STARTED });

            return of<any>(
              new vmActions.DeploymentInitActionList(
                this.initializeDeploymentActionList(action.payload),
              ),
              new vmActions.DeploymentRequest(action.payload),
            );
          }
          return of(
            new vmActions.VmCreationStateUpdate({
              showOverlay: false,
              deploymentInProgress: false,
            }),
          );
        }),
      );
    }),
  );

  @Effect()
  deploying$ = this.actions$.pipe(
    ofType(vmActions.VM_DEPLOYMENT_REQUEST),
    withLatestFrom(this.store.pipe(select(UserTagsSelectors.getKeyboardLayout))),
    switchMap(([action, keyboard]: [vmActions.DeploymentRequest, KeyboardLayout]) => {
      return this.doCreateSecurityGroup(action.payload).pipe(
        switchMap(securityGroups => {
          if (action.payload.securityGroupData.mode === VmCreationSecurityGroupMode.Builder) {
            this.store.dispatch(
              new securityGroupActions.CreateSecurityGroupsSuccess(securityGroups),
            );
          }
          this.store.dispatch(
            new vmActions.DeploymentChangeStatus({
              stage: VmDeploymentStage.SG_GROUP_CREATION_FINISHED,
            }),
          );

          this.handleDeploymentMessages({ stage: VmDeploymentStage.VM_CREATION_IN_PROGRESS });
          const params = this.getVmCreationParams(action.payload, keyboard, securityGroups);
          let deployResponse;

          return this.vmService.deploy(params).pipe(
            switchMap(response => {
              deployResponse = response;
              return this.vmService.get(deployResponse.id);
            }),
            switchMap(() => {
              this.handleDeploymentMessages({ stage: VmDeploymentStage.TEMP_VM });

              this.store.dispatch(new UserTagsActions.IncrementLastVMId());
              return this.vmService.registerVmJob(deployResponse);
            }),
            switchMap((deployedVm: VirtualMachine) => {
              this.handleDeploymentMessages({ stage: VmDeploymentStage.VM_DEPLOYED });

              return this.doCreateInstanceGroup(deployedVm, action.payload).pipe(
                switchMap(virtualMachine => this.doCopyTags(virtualMachine, action.payload)),
              );
            }),
            map(vmWithTags => {
              if (action.payload.doStartVm) {
                vmWithTags.state = VmState.Running;
              }
              return new vmActions.DeploymentRequestSuccess(vmWithTags);
            }),
            catchError(error => of(new vmActions.DeploymentRequestError(error))),
          );
        }),
        catchError(error => of(new vmActions.DeploymentRequestError(error))),
      );
    }),
  );

  @Effect({ dispatch: false })
  changeStatusOfDeployment$ = this.actions$.pipe(
    ofType(vmActions.VM_DEPLOYMENT_CHANGE_STATUS),
    tap((action: vmActions.DeploymentChangeStatus) => {
      this.handleDeploymentMessages(action.payload);
    }),
  );

  @Effect()
  deploymentSuccess$ = this.actions$.pipe(
    ofType<vmActions.DeploymentRequestSuccess>(vmActions.VM_DEPLOYMENT_REQUEST_SUCCESS),
    tap(() => this.handleDeploymentMessages({ stage: VmDeploymentStage.FINISHED })),
    map(action => new vmActions.LoadVirtualMachine({ id: action.payload.id })),
  );

  @Effect()
  deploymentError$: Observable<Action> = this.actions$.pipe(
    ofType(vmActions.VM_DEPLOYMENT_REQUEST_ERROR),
    map((action: vmActions.DeploymentRequestError) => {
      const message = 'NOTIFICATIONS.VM.DEPLOY_FAILED';
      this.jobsNotificationService.fail({
        message,
        id: this.deploymentNotificationId,
      });

      return new vmActions.DeploymentAddLoggerMessage({
        text: action.payload.params
          ? {
              translationToken: action.payload.message,
              interpolateParams: action.payload.params,
            }
          : action.payload.message,
        status: [ProgressLoggerMessageStatus.ErrorMessage],
      });
    }),
  );

  private deploymentNotificationId: string;

  constructor(
    private store: Store<State>,
    private actions$: Actions,
    private vmService: VmService,
    private jobsNotificationService: JobsNotificationService,
    private templateTagService: TemplateTagService,
    private dialog: MatDialog,
    private auth: AuthService,
    private resourceUsageService: ResourceUsageService,
    private vmCreationSecurityGroupService: VmCreationSecurityGroupService,
    private instanceGroupService: InstanceGroupService,
    private vmTagService: VmTagService,
    private snackBar: SnackBarService,
  ) {}

  private handleDeploymentMessages(deploymentMessage: VmDeploymentMessage): void {
    switch (deploymentMessage.stage) {
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
      default:
        break;
    }
  }

  private getDeploymentActionList(state: VmCreationState): VmDeploymentStage[] {
    const doCopyTags = true;

    return [
      this.createSecurityGroup(state) ? VmDeploymentStage.SG_GROUP_CREATION : null,
      VmDeploymentStage.VM_CREATION_IN_PROGRESS,
      this.createInstanceGroup(state) ? VmDeploymentStage.INSTANCE_GROUP_CREATION : null,
      doCopyTags ? VmDeploymentStage.TAG_COPYING : null,
    ].filter(_ => _);
  }

  private initializeDeploymentActionList(state: VmCreationState): ProgressLoggerMessageData[] {
    const translations = {
      [VmDeploymentStage.SG_GROUP_CREATION]: 'VM_PAGE.VM_CREATION.CREATING_SG',
      [VmDeploymentStage.VM_CREATION_IN_PROGRESS]: 'VM_PAGE.VM_CREATION.DEPLOYING_VM',
      [VmDeploymentStage.INSTANCE_GROUP_CREATION]: 'VM_PAGE.VM_CREATION.CREATING_INSTANCE_GROUP',
      [VmDeploymentStage.TAG_COPYING]: 'VM_PAGE.VM_CREATION.TAG_COPYING',
    };

    const loggerStageList = [];

    this.getDeploymentActionList(state).forEach(actionName => {
      loggerStageList.push({ text: translations[actionName] });
    });

    return loggerStageList;
  }

  private onSecurityGroupCreation(): void {
    this.updateLoggerMessage('VM_PAGE.VM_CREATION.CREATING_SG', [
      ProgressLoggerMessageStatus.Highlighted,
      ProgressLoggerMessageStatus.InProgress,
    ]);
  }

  private onSecurityGroupCreationFinished(): void {
    this.updateLoggerMessage('VM_PAGE.VM_CREATION.CREATING_SG', [ProgressLoggerMessageStatus.Done]);
  }

  private onVmCreationInProgress(): void {
    this.updateLoggerMessage('VM_PAGE.VM_CREATION.DEPLOYING_VM', [
      ProgressLoggerMessageStatus.Highlighted,
      ProgressLoggerMessageStatus.InProgress,
    ]);
  }

  private onVmCreationFinished(): void {
    this.updateLoggerMessage('VM_PAGE.VM_CREATION.DEPLOYING_VM', [
      ProgressLoggerMessageStatus.Done,
    ]);
  }

  private onInstanceGroupCreation(): void {
    this.updateLoggerMessage('VM_PAGE.VM_CREATION.CREATING_INSTANCE_GROUP', [
      ProgressLoggerMessageStatus.Highlighted,
      ProgressLoggerMessageStatus.InProgress,
    ]);
  }

  private onInstanceGroupCreationFinished(): void {
    this.updateLoggerMessage('VM_PAGE.VM_CREATION.CREATING_INSTANCE_GROUP', [
      ProgressLoggerMessageStatus.Done,
    ]);
  }

  private onTagCopying(): void {
    this.updateLoggerMessage('VM_PAGE.VM_CREATION.TAG_COPYING', [
      ProgressLoggerMessageStatus.Highlighted,
      ProgressLoggerMessageStatus.InProgress,
    ]);
  }

  private onTagCopyingFinished(): void {
    this.updateLoggerMessage('VM_PAGE.VM_CREATION.TAG_COPYING', [ProgressLoggerMessageStatus.Done]);
  }

  private onDeployDone(): void {
    const message = 'NOTIFICATIONS.VM.DEPLOY_DONE';
    this.jobsNotificationService.finish({
      message,
      id: this.deploymentNotificationId,
    });
    this.snackBar.open(message).subscribe();
  }

  private updateLoggerMessage(
    messageText: string | ParametrizedTranslation,
    status?: ProgressLoggerMessageStatus[],
  ): void {
    this.store.dispatch(
      new vmActions.DeploymentUpdateLoggerMessage({ messageText, data: { status } }),
    );
  }

  private showTemplateAgreementDialog(state: VmCreationState): Observable<BaseTemplateModel> {
    return this.dialog
      .open(VmCreationAgreementComponent, {
        width: '900px',
        data: state.template,
      })
      .afterClosed();
  }

  private createSecurityGroup = (state: VmCreationState) =>
    state.zone &&
    state.zone.securitygroupsenabled &&
    state.securityGroupData.mode === VmCreationSecurityGroupMode.Builder &&
    !!state.securityGroupData.rules.templates.length;

  private createInstanceGroup = (state: VmCreationState) =>
    state.instanceGroup && !!state.instanceGroup.name;

  private doCreateSecurityGroup(state: VmCreationState) {
    if (this.createSecurityGroup(state)) {
      this.handleDeploymentMessages({ stage: VmDeploymentStage.SG_GROUP_CREATION });

      return this.vmCreationSecurityGroupService.getSecurityGroupCreationRequest(state);
    }
    return of(state.securityGroupData.securityGroups);
  }

  private doCreateInstanceGroup(vm: VirtualMachine, state: VmCreationState) {
    if (this.createInstanceGroup(state)) {
      this.handleDeploymentMessages({ stage: VmDeploymentStage.INSTANCE_GROUP_CREATION });

      return this.instanceGroupService.add(vm, state.instanceGroup).pipe(
        map((virtualMachine: VirtualMachine) => {
          this.store.dispatch(
            new vmActions.DeploymentChangeStatus({
              stage: VmDeploymentStage.INSTANCE_GROUP_CREATION_FINISHED,
            }),
          );
          return virtualMachine;
        }),
      );
    }
    return of(vm);
  }

  private doCopyTags(vm: VirtualMachine, state: VmCreationState): Observable<VirtualMachine> {
    this.handleDeploymentMessages({ stage: VmDeploymentStage.TAG_COPYING });
    return this.vmTagService.copyTagsToEntity(state.template.tags, vm).pipe(
      switchMap(() => {
        if (state.agreement) {
          return this.vmTagService.setAgreement(vm);
        }
        return of(null);
      }),
      map(() => {
        this.store.dispatch(
          new vmActions.DeploymentChangeStatus({
            stage: VmDeploymentStage.TAG_COPYING_FINISHED,
          }),
        );
        return { ...vm, tags: [...vm.tags] } as VirtualMachine;
      }),
    );
  }

  private getVmCreationParams(
    state: VmCreationState,
    keyboard: KeyboardLayout,
    securityGroups?: SecurityGroup[],
  ) {
    const params: VmCreationParams = {};

    if (state.affinityGroup) {
      params.affinityGroupNames = state.affinityGroup.name;
    }

    params.startVm = state.doStartVm.toString();
    params.keyboard = keyboard;
    params.name = state.displayName;
    params.serviceOfferingId = state.serviceOffering.id;
    params.templateId = state.template.id;
    params.zoneId = state.zone.id;

    if (state.sshKeyPair && !(state.sshKeyPair as NotSelected).ignore) {
      params.keyPair = state.sshKeyPair.name;
    }

    if (state.diskOffering && !isTemplate(state.template)) {
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
          memory: state.serviceOffering.memory,
        },
      ];
    }

    if (
      (state.rootDiskSize != null && isTemplate(state.template)) ||
      (state.diskOffering && state.diskOffering.iscustomized)
    ) {
      if (isTemplate(state.template)) {
        params.rootDiskSize = state.rootDiskSize;
      } else {
        params.size = state.rootDiskSize;
      }
    }

    return params;
  }

  private getPreselectedOffering(
    offerings: ComputeOfferingViewModel[],
    zone: Zone,
    defaultComputeOfferingConfiguration: DefaultComputeOffering[],
  ): ComputeOfferingViewModel {
    const firstOffering = offerings[0];
    const configForCurrentZone = defaultComputeOfferingConfiguration.find(
      config => config.zoneId === zone.id,
    );
    if (!configForCurrentZone) {
      return firstOffering;
    }
    const preselectedOffering = offerings.find(
      offering => offering.id === configForCurrentZone.offeringId,
    );

    return preselectedOffering ? preselectedOffering : firstOffering;
  }
}
