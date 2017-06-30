import { Injectable } from '@angular/core';
import { VmCreationState } from './data/vm-creation-state';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { VmService } from '../shared/vm.service';
import { VirtualMachine, VmStates } from '../shared/vm.model';
import { AffinityGroupService, InstanceGroupService } from '../../shared/services';
import { AffinityGroup } from '../../shared/models';
import { SecurityGroup } from '../../security-group/sg.model';
import { GROUP_POSTFIX, SecurityGroupService } from '../../shared/services/security-group.service';
import { Utils } from '../../shared/services/utils.service';


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

@Injectable()
export class VmDeploymentService {
  constructor(
    private affinityGroupService: AffinityGroupService,
    private instanceGroupService: InstanceGroupService,
    private securityGroupObservable: SecurityGroupService,
    private vmService: VmService
  ) {}

  public deploy(state: VmCreationState): Observable<VmDeploymentMessage> {
    const deployObservable = new Subject<VmDeploymentMessage>();
    let deployedVm;
    let tempVm;

    deployObservable.next({ stage: VmDeploymentStages.STARTED });
    Observable
      .concat(...this.getPreDeployActions(deployObservable, state))
      .switchMap(_ => this.sendDeployRequest(deployObservable, state))
      .switchMap(({ deployResponse, temporaryVm }) => {
        tempVm = temporaryVm;
        return this.vmService.registerVmJob(deployResponse);
      })
      .concatMap(vm => {
        deployedVm = vm;
        deployObservable.next({ stage: VmDeploymentStages.VM_DEPLOYED });
        return Observable.concat(...this.getPostDeployActions(vm, state));
      })
      .subscribe(
        () => this.handleSuccessfulDeployment(deployedVm, deployObservable),
        error => this.handleFailedDeployment(error, tempVm, deployObservable)
      );

    return deployObservable;
  }

  private getPreDeployActions(
    deployObservable: Subject<VmDeploymentMessage>,
    state: VmCreationState
  ): Array<Observable<any>> {
    let actions = [];
    actions.push(this.getAffinityGroupCreationObservable(deployObservable, state));
    if (!state.zone.networkTypeIsBasic) {
      actions.push(this.getSecurityGroupCreationObservable(deployObservable, state));
    }
    return actions;
  }

  private getPostDeployActions(vm: VirtualMachine, state: VmCreationState): any {
    return [this.instanceGroupService.add(vm, state.instanceGroup)];
  }

  private getAffinityGroupCreationObservable(
    deployObservable: Subject<VmDeploymentMessage>,
    state: VmCreationState
  ): Observable<AffinityGroup> {
    const affinityGroupExists = state.affinityGroupExists;
    if (!state.affinityGroup || affinityGroupExists) { return Observable.of(null); }
    deployObservable.next({ stage: VmDeploymentStages.AG_GROUP_CREATION });
    return this.affinityGroupService.create({
      name: state.affinityGroup.name,
      type: state.affinityGroup.type
    })
      .do(_ => deployObservable.next({ stage: VmDeploymentStages.AG_GROUP_CREATION_FINISHED }));
  }

  private getSecurityGroupCreationObservable(
    deployObservable: Subject<VmDeploymentMessage>,
    state: VmCreationState
  ): Observable<SecurityGroup> {
    const name = Utils.getUniqueId() + GROUP_POSTFIX;
    deployObservable.next({ stage: VmDeploymentStages.SG_GROUP_CREATION });
    return this.securityGroupObservable.createWithRules(
      { name },
      state.securityRules.ingress,
      state.securityRules.egress
    )
      .do(_ => deployObservable.next({ stage: VmDeploymentStages.SG_GROUP_CREATION_FINISHED }));
  }

  private sendDeployRequest(
    deployObservable: Subject<VmDeploymentMessage>,
    state: VmCreationState
  ): Observable<{ deployResponse: any, temporaryVm: VirtualMachine }> {
    const params = state.getVmCreationParams();
    let deployResponse;
    let temporaryVm;
    return this.vmService.deploy(params)
      .do(_ => deployObservable.next({ stage: VmDeploymentStages.IN_PROGRESS }))
      .switchMap(response => {
        deployResponse = response;
        return this.vmService.get(deployResponse.id);
      })
      .do(vm => {
        temporaryVm = vm;
        this.nextTemporaryVm(vm, deployObservable);
      })
      .switchMap(() => this.vmService.incrementNumberOfVms())
      .map(() => ({ deployResponse, temporaryVm }));
  }

  private nextTemporaryVm(
    temporaryVm: VirtualMachine,
    deployObservable: Subject<VmDeploymentMessage>
  ): void {
    temporaryVm.state = VmStates.Deploying;
    deployObservable.next({
      stage: VmDeploymentStages.TEMP_VM,
      vm: temporaryVm
    });
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
