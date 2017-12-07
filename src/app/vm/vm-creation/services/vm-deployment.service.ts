import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { SecurityGroup } from '../../../security-group/sg.model';
import { AffinityGroup, AffinityGroupType } from '../../../shared/models';
import { AffinityGroupService } from '../../../shared/services/affinity-group.service';
import { InstanceGroupService } from '../../../shared/services/instance-group.service';
import { TagService } from '../../../shared/services/tags/tag.service';
import { VirtualMachineTagKeys } from '../../../shared/services/tags/vm-tag-keys';
import { VirtualMachine, VmState } from '../../shared/vm.model';
import { VmService } from '../../shared/vm.service';
import { NotSelected, VmCreationState } from '../data/vm-creation-state';
import { VmCreationSecurityGroupService } from './vm-creation-security-group.service';
import { UserTagService } from '../../../shared/services/tags/user-tag.service';
import { VmTagService } from '../../../shared/services/tags/vm-tag.service';
import { NetworkRule } from '../../../security-group/network-rule.model';

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

export interface VmDeployObservables {
  deployStatusObservable: Observable<VmDeploymentMessage>;
  deployObservable: Observable<any>;
}

@Injectable()
export class VmDeploymentService {
  constructor(
    private affinityGroupService: AffinityGroupService,
    private instanceGroupService: InstanceGroupService,
    private tagService: TagService,
    private vmCreationSecurityGroupService: VmCreationSecurityGroupService,
    private vmService: VmService,
    private userTagService: UserTagService,
    private vmTagService: VmTagService,
  ) {
  }

  public deploy(): Observable<VmDeployObservables> {
    const deployStatusObservable = new Subject<VmDeploymentMessage>();
    return Observable.of({
      deployStatusObservable,
      deployObservable: this.deployObservable(deployStatusObservable)
    });
  }

  private deployObservable(deployObservable): Observable<any> {
    return Observable.of(null);
  }

  public getPreDeployActions(
    deployObservable: Subject<VmDeploymentMessage>,
    state: VmCreationState
  ): Observable<VmCreationState> {
    return Observable.of(null)
      .switchMap(() => {
        return this.getAffinityGroupCreationObservable(deployObservable, state);
      })
      .switchMap(() => {
        return this.getSecurityGroupCreationObservable(deployObservable, state)
          .map((securityGroups: SecurityGroup[]) => {
            state.securityGroupData.securityGroups = securityGroups;
            return state;
          });
      });
  }

  public getPostDeployActions(
    deployObservable: Subject<VmDeploymentMessage>,
    state: VmCreationState,
    vm: VirtualMachine
  ): Observable<any> {
    return this.getInstanceGroupCreationObservable(deployObservable, state, vm)
      .switchMap(() => this.getTagCopyingObservable(deployObservable, state, vm));
  }

  private getInstanceGroupCreationObservable(
    deployObservable: Subject<VmDeploymentMessage>,
    state: VmCreationState,
    vm: VirtualMachine
  ): Observable<any> {
    if (!(state.instanceGroup && state.instanceGroup.name)) {
      return Observable.of(null);
    }

    return Observable.of(null)
      .do(() => {
        deployObservable.next({
          stage: VmDeploymentStage.INSTANCE_GROUP_CREATION
        });
      })
      .switchMap(() => {
        return this.instanceGroupService.add(vm, state.instanceGroup);
      })
      .do(() => {
        deployObservable.next({
          stage: VmDeploymentStage.INSTANCE_GROUP_CREATION_FINISHED
        });
      });
  }

  private getTagCopyingObservable(
    deployObservable: Subject<VmDeploymentMessage>,
    state: VmCreationState,
    vm: VirtualMachine
  ): Observable<any> {
    return Observable.of(null)
      .do(() => {
        deployObservable.next({
          stage: VmDeploymentStage.TAG_COPYING
        });
      })
      .switchMap(() => {
        return this.tagService.copyTagsToEntity(state.template.tags, vm);
      })
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
      .do(() => {
        deployObservable.next({
          stage: VmDeploymentStage.TAG_COPYING_FINISHED
        });
      });
  }

  private getAffinityGroupCreationObservable(
    deployObservable: Subject<VmDeploymentMessage>,
    state: VmCreationState
  ): Observable<AffinityGroup> {
    if (!(state.affinityGroup && state.affinityGroup.name) ||
      state.affinityGroupNames.includes(state.affinityGroup.name)) {
      return Observable.of(null);
    }

    return Observable.of(null)
      .do(() => {
        deployObservable.next({
          stage: VmDeploymentStage.AG_GROUP_CREATION
        });
      })
      .switchMap(() => {
        return this.affinityGroupService.create({
          name: state.affinityGroup.name,
          type: AffinityGroupType.hostAntiAffinity
        });
      })
      .do(() => {
        deployObservable.next({
          stage: VmDeploymentStage.AG_GROUP_CREATION_FINISHED
        });
      });
  }

  private getSecurityGroupCreationObservable(
    deployObservable: Subject<VmDeploymentMessage>,
    state: VmCreationState
  ): Observable<SecurityGroup[]> {
    if (!(state.zone && !state.zone.networkTypeIsBasic)) {
      return Observable.of(null);
    }

    return Observable.of(null)
      .do(() => {
        deployObservable.next({
          stage: VmDeploymentStage.SG_GROUP_CREATION
        });
      })
      .switchMap(() => {
        return this
          .vmCreationSecurityGroupService
          .getSecurityGroupCreationRequest(state.securityGroupData);
      })
      .do(() => {
        deployObservable.next({
          stage: VmDeploymentStage.SG_GROUP_CREATION_FINISHED
        });
      });
  }

  public sendDeployRequest(
    deployObservable: Subject<VmDeploymentMessage>,
    state: VmCreationState
  ): Observable<{ deployResponse: any, temporaryVm: VirtualMachine }> {
    const params = this.getVmCreationParams(state);
    let deployResponse;
    let temporaryVm;

    return Observable.of(null)
      .do(() => {
        deployObservable.next({
          stage: VmDeploymentStage.VM_CREATION_IN_PROGRESS
        });
      })
      .switchMap(() => this.vmService.deploy(params))
      .switchMap(response => {
        deployResponse = response;
        return this.vmService.get(deployResponse.id);
      })
      .do(vm => {
        temporaryVm = vm;
        this.handleTemporaryVm(vm, deployObservable);
      })
      .switchMap(() => this.vmService.incrementNumberOfVms())
      .map(() => ({ deployResponse, temporaryVm }));
  }

  private handleTemporaryVm(
    temporaryVm: VirtualMachine,
    deployObservable: Subject<VmDeploymentMessage>
  ): void {
    temporaryVm.state = VmState.Deploying;
    deployObservable.next({
      stage: VmDeploymentStage.TEMP_VM,
      vm: temporaryVm
    });
  }

  public handleSuccessfulDeployment(
    vm: VirtualMachine,
    deployObservable: Subject<VmDeploymentMessage>
  ): void {
    deployObservable.next({
      stage: VmDeploymentStage.FINISHED,
      vm
    });
  }

  public handleFailedDeployment(
    error: any,
    temporaryVm: VirtualMachine,
    deployObservable: Subject<VmDeploymentMessage>
  ): void {
    if (temporaryVm) {
      temporaryVm.state = VmState.Error;
    }

    deployObservable.next({
      stage: VmDeploymentStage.ERROR,
      error
    });
  }

  private getVmCreationParams(state) {
    const params: VmCreationParams = {};

    if (state.affinityGroup) {
      params.affinityGroupNames = state.affinityGroup.name;
    }

    params.startVm = state.doStartVm;
    params.keyboard = state.keyboard;
    params.name = state.displayName || state.defaultName;
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

    if (
      state.securityGroupData &&
      state.securityGroupData.securityGroups &&
      state.securityGroupData.securityGroups.length &&
      state.securityGroupData.securityGroups[0].id
    ) {
      params.securityGroupIds = state.securityGroupData.securityGroups.map(item => item.id).join(',');
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
