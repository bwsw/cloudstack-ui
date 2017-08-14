import { Injectable } from '@angular/core';
import { VmCreationState } from '../data/vm-creation-state';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { VmService } from '../../shared/vm.service';
import { VirtualMachine, VmStates } from '../../shared/vm.model';
import { AffinityGroupService, InstanceGroupService } from '../../../shared/services';
import { AffinityGroup, AffinityGroupTypes } from '../../../shared/models';
import { SecurityGroup } from '../../../security-group/sg.model';
import { GROUP_POSTFIX, SecurityGroupService } from '../../../shared/services/security-group.service';
import { Utils } from '../../../shared/services/utils.service';
import { TagService } from '../../../shared/services/tag.service';


export type VmDeploymentStage =
  'STARTED' |
  'IN_PROGRESS' |
  'AG_GROUP_CREATION' |
  'AG_GROUP_CREATION_FINISHED' |
  'SG_GROUP_CREATION' |
  'SG_GROUP_CREATION_FINISHED' |
  'VM_DEPLOYED' |
  'FINISHED' |
  'ERROR' |
  'TEMP_VM';

export const VmDeploymentStages = {
  STARTED: 'STARTED' as VmDeploymentStage,
  IN_PROGRESS: 'IN_PROGRESS' as VmDeploymentStage,
  AG_GROUP_CREATION: 'AG_GROUP_CREATION' as VmDeploymentStage,
  AG_GROUP_CREATION_FINISHED: 'AG_GROUP_CREATION_FINISHED' as VmDeploymentStage,
  SG_GROUP_CREATION: 'SG_GROUP_CREATION' as VmDeploymentStage,
  SG_GROUP_CREATION_FINISHED: 'SG_GROUP_CREATION_FINISHED' as VmDeploymentStage,
  VM_DEPLOYED: 'VM_DEPLOYED' as VmDeploymentStage,
  FINISHED: 'FINISHED' as VmDeploymentStage,
  ERROR: 'ERROR' as VmDeploymentStage,
  TEMP_VM: 'TEMP_VM' as VmDeploymentStage
};

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
          stage: VmDeploymentStages.STARTED
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
          stage: VmDeploymentStages.VM_DEPLOYED
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
          stage: VmDeploymentStages.AG_GROUP_CREATION
        });
      })
      .switchMap(() => {
        return this.affinityGroupService.create({
          name: state.affinityGroup.name,
          type: AffinityGroupTypes.hostAntiAffinity
        });
      })
      .do(() => {
        deployObservable.next({
          stage: VmDeploymentStages.AG_GROUP_CREATION_FINISHED
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
          stage: VmDeploymentStages.SG_GROUP_CREATION
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
          stage: VmDeploymentStages.SG_GROUP_CREATION_FINISHED
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
          stage: VmDeploymentStages.IN_PROGRESS
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
    temporaryVm.state = VmStates.Deploying;
    deployObservable.next({
      stage: VmDeploymentStages.TEMP_VM,
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
      stage: VmDeploymentStages.FINISHED,
      vm
    });
  }

  private handleFailedDeployment(
    error: any,
    temporaryVm: VirtualMachine,
    deployObservable: Subject<VmDeploymentMessage>
  ): void {
    if (temporaryVm) {
      temporaryVm.state = VmStates.Error;
      this.vmService.updateVmInfo(temporaryVm);
    }

    deployObservable.next({
      stage: VmDeploymentStages.ERROR,
      error
    });
  }
}
