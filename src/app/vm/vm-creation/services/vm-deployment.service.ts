import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { SecurityGroup } from '../../../security-group/sg.model';
import { AffinityGroup, AffinityGroupType } from '../../../shared/models';
import { AffinityGroupService } from '../../../shared/services/affinity-group.service';
import { InstanceGroupService } from '../../../shared/services/instance-group.service';
import { GROUP_POSTFIX, SecurityGroupService } from '../../../security-group/services/security-group.service';
import { TagService } from '../../../shared/services/tags/tag.service';
import { Utils } from '../../../shared/services/utils/utils.service';
import { VirtualMachine, VmState } from '../../shared/vm.model';
import { VmService } from '../../shared/vm.service';
import { VmCreationState } from '../data/vm-creation-state';
import { VmCreationSecurityGroupService } from './vm-creation-security-group.service';
import { PostdeploymentComponent } from '../postdeployment/postdeployment.component';
import { MdDialog } from '@angular/material';

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
    private tagService: TagService,
    private vmCreationSecurityGroupService: VmCreationSecurityGroupService,
    private vmService: VmService,
    private dialog: MdDialog
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
      .switchMap(modifiedState => this.sendDeployRequest(deployObservable, modifiedState))
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
  ): Observable<VmCreationState> {
    return Observable.of(null)
      .switchMap(() => {
        return this.getAffinityGroupCreationObservable(deployObservable, state)
      })
      .switchMap(() => {
        if (state.zone.networkTypeIsBasic) { return Observable.of(null); }
        return this.getSecurityGroupCreationObservable(deployObservable, state)
      })
      .map(securityGroup => {
        state.securityGroupData.securityGroup = securityGroup;
        return state;
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
    this.dialog.open(PostdeploymentComponent, {
      width: '500px',
      data: {
        vm: vm
      }
    }).afterClosed();
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
