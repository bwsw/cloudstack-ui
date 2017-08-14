import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { SecurityGroup } from '../../../security-group/sg.model';
import { AffinityGroup, AffinityGroupType } from '../../../shared/models';
import { AffinityGroupService } from '../../../shared/services/affinity-group.service';
import { InstanceGroupService } from '../../../shared/services/instance-group.service';
import {
  GROUP_POSTFIX,
  SecurityGroupService
} from '../../../shared/services/security-group.service';
import { TagService } from '../../../shared/services/tag.service';
import { Utils } from '../../../shared/services/utils.service';
import { VirtualMachine, VmState } from '../../shared/vm.model';
import { VmService } from '../../shared/vm.service';
import { VmCreationState } from '../data/vm-creation-state';


export enum VmDeploymentStage {
  STARTED = 'STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  AG_GROUP_CREATION = 'AG_GROUP_CREATION',
  AG_GROUP_CREATION_FINISHED = 'AG_GROUP_CREATION_FINISHED',
  SG_GROUP_CREATION = 'SG_GROUP_CREATION',
  SG_GROUP_CREATION_FINISHED = 'SG_GROUP_CREATION_FINISHED',
  VM_DEPLOYED = 'VM_DEPLOYED',
  FINISHED = 'FINISHED',
  ERROR = 'ERROR',
  TEMP_VM = 'TEMP_VM'
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
    private securityGroupObservable: SecurityGroupService,
    private tagService: TagService,
    private vmService: VmService
  ) {}

  public deploy(state: VmCreationState): VmDeployObservables {
    const deployStatusObservable = new Subject<VmDeploymentMessage>();

    return {
      deployStatusObservable,
      deployObservable: this.deployObservable(deployStatusObservable, state)
    }
  }

  private deployObservable(deployObservable, state): Observable<any> {
    let deployedVm;
    let tempVm;
    return Observable.of(null)
      .do(() => {
        deployObservable.next({
          stage: VmDeploymentStage.STARTED
        });
      })
      .switchMap(() => this.getPreDeployActions(deployObservable, state))
      .switchMap(() => this.sendDeployRequest(deployObservable, state))
      .switchMap(({ deployResponse, temporaryVm }) => {
        tempVm = temporaryVm;
        return this.vmService.registerVmJob(deployResponse);
      })
      .switchMap(vm => {
        deployedVm = vm;
        deployObservable.next({
          stage: VmDeploymentStage.VM_DEPLOYED
        });
        return this.getPostDeployActions(vm, state);
      })
      .map(() => this.handleSuccessfulDeployment(deployedVm, deployObservable))
      .catch(error => {
        this.handleFailedDeployment(error, tempVm, deployObservable);
        return Observable.of(null);
      })
  }

  private getPreDeployActions(
    deployObservable: Subject<VmDeploymentMessage>,
    state: VmCreationState
  ): Observable<any> {
    return Observable.of(null)
      .switchMap(() => {
        return this.getAffinityGroupCreationObservable(deployObservable, state)
      })
      .switchMap(() => {
        if (state.zone.networkTypeIsBasic) { return Observable.of(null); }
        return this.getSecurityGroupCreationObservable(deployObservable, state)
      });
  }

  private getPostDeployActions(vm: VirtualMachine, state: VmCreationState): Observable<any> {
    return Observable.forkJoin(
      this.instanceGroupService.add(vm, state.instanceGroup),
      this.tagService.copyTagsToEntity(state.template.tags, vm)
    );
  }

  private getAffinityGroupCreationObservable(
    deployObservable: Subject<VmDeploymentMessage>,
    state: VmCreationState
  ): Observable<AffinityGroup> {
    if (!state.affinityGroup.name || state.affinityGroupExists) {
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
  ): Observable<SecurityGroup> {
    const name = Utils.getUniqueId() + GROUP_POSTFIX;
    return Observable.of(null)
      .do(() => {
        deployObservable.next({
          stage: VmDeploymentStage.SG_GROUP_CREATION
        });
      })
      .switchMap(() => {
        return this.securityGroupObservable.createWithRules(
          { name },
          state.securityRules.ingress,
          state.securityRules.egress
        );
      })
      .do(() => {
        deployObservable.next({
          stage: VmDeploymentStage.SG_GROUP_CREATION_FINISHED
        })
      })
  }

  private sendDeployRequest(
    deployObservable: Subject<VmDeploymentMessage>,
    state: VmCreationState
  ): Observable<{ deployResponse: any, temporaryVm: VirtualMachine }> {
    const params = state.getVmCreationParams();
    let deployResponse;
    let temporaryVm;
    return this.vmService.deploy(params)
      .do(() => {
        return deployObservable.next({
          stage: VmDeploymentStage.IN_PROGRESS
        })
      })
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
    this.vmService.updateVmInfo(temporaryVm);
  }

  private handleSuccessfulDeployment(
    vm: VirtualMachine,
    deployObservable: Subject<VmDeploymentMessage>
  ): void {
    this.vmService.updateVmInfo(vm);
    deployObservable.next({
      stage: VmDeploymentStage.FINISHED,
      vm
    });
  }

  private handleFailedDeployment(
    error: any,
    temporaryVm: VirtualMachine,
    deployObservable: Subject<VmDeploymentMessage>
  ): void {
    if (temporaryVm) {
      temporaryVm.state = VmState.Error;
      this.vmService.updateVmInfo(temporaryVm);
    }

    deployObservable.next({
      stage: VmDeploymentStage.ERROR,
      error
    });
  }
}
