import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { SecurityGroup } from '../../security-group/sg.model';
import { BackendResource } from '../../shared/decorators';
import { AsyncJob, OsType, ServiceOffering, Volume } from '../../shared/models';
import { AsyncJobService, BaseBackendService, OsTypeService, } from '../../shared/services';
import { Iso } from '../../template/shared';
import { VirtualMachine, VmState } from './vm.model';
import { ServiceOfferingService } from '../../shared/services/service-offering.service';
import { SecurityGroupService } from '../../shared/services/security-group.service';
import { VolumeService } from '../../shared/services/volume.service';
import { InstanceGroup } from '../../shared/models/instance-group.model';
import { VirtualMachineActionType } from '../vm-actions/vm-action';
import { IVirtualMachineCommand } from '../vm-actions/vm-command';
import { UserTagService } from '../../shared/services/tags/user-tag.service';


export const VirtualMachineEntityName = 'VirtualMachine';

@Injectable()
@BackendResource({
  entity: VirtualMachineEntityName,
  entityModel: VirtualMachine
})
export class VmService extends BaseBackendService<VirtualMachine> {
  public vmUpdateObservable = new Subject<VirtualMachine>();

  constructor(
    private asyncJobService: AsyncJobService,
    private osTypesService: OsTypeService,
    private serviceOfferingService: ServiceOfferingService,
    private securityGroupService: SecurityGroupService,
    private userTagService: UserTagService,
    private volumeService: VolumeService
  ) {
    super();
  }

  public getNumberOfVms(): Observable<number> {
    return this.userTagService.getLastVmId()
      .switchMap(numberOfVms => {
        if (numberOfVms !== undefined && !Number.isNaN(+numberOfVms)) {
          return Observable.of(+numberOfVms);
        }

        return this.getListWithDetails({}, true)
          .switchMap(vmList => {
            return this.userTagService.setLastVmId(vmList.length);
          });
      });
  }

  public incrementNumberOfVms(): Observable<number> {
    return this.getNumberOfVms()
      .switchMap(numberOfVms => this.userTagService.setLastVmId(numberOfVms + 1));
  }

  public updateVmInfo(vm: VirtualMachine): void {
    this.vmUpdateObservable.next(vm);
  }

  public getWithDetails(id: string): Observable<VirtualMachine> {
    return this.getListWithDetails().map(list =>
      list.find(vm => vm.id === id)
    );
  }

  public getListWithDetails(params?: {}, lite = false): Observable<Array<VirtualMachine>> {
    if (lite) {
      return super.getList(params);
    }
    return Observable.forkJoin(
      super.getList(params),
      this.volumeService.getList(),
      this.osTypesService.getList(),
      this.serviceOfferingService.getList(),
      this.securityGroupService.getList()
    )
      .map(([vmList, volumes, osTypes, serviceOfferings, securityGroups]) => {
        vmList.forEach((currentVm, index, vms) => {
          currentVm = this.addVolumes(currentVm, volumes);
          currentVm = this.addOsType(currentVm, osTypes);
          currentVm = this.addServiceOffering(currentVm, serviceOfferings);
          currentVm = this.addSecurityGroups(currentVm, securityGroups);
          vms[index] = currentVm;
        });
        return vmList;
      });
  }

  public getInstanceGroupList(): Observable<Array<InstanceGroup>> {
    return this.getListWithDetails()
      .map(vmList => vmList.reduce((groups, vm) => {
        const group = vm.tags.find(tag => tag.key === 'csui.vm.group');

        if (!group || !group.value || groups.find(g => g.name === group.value)) {
          return groups;
        } else {
          return groups.concat(new InstanceGroup(group.value));
        }
      }, []));
  }

  public deploy(params: {}): Observable<any> {
    return this.sendCommand('deploy', params);
  }

  public resubscribe(): Observable<Array<Observable<AsyncJob<VirtualMachine>>>> {
    return this.asyncJobService.getList().map(jobs => {
      const filteredJobs = jobs.filter(job => !job.status && job.cmd);
      const observables = [];
      filteredJobs.forEach(job => {
        observables.push(this.registerVmJob(job));
      });
      return observables;
    });
  }

  public command(vm: VirtualMachine, command: IVirtualMachineCommand): Observable<any> {
    const commandName = command.commandName as VirtualMachineActionType;
    const initialState = vm.state;

    this.setStateForVm(vm, command.vmStateOnAction as VmState);

    return this.sendCommand(
      commandName,
      this.buildCommandParams(vm.id, commandName)
    )
      .switchMap(job => this.registerVmJob(job))
      .catch(error => {
        this.setStateForVm(vm, initialState);
        return Observable.throw(error);
      })
  }

  public registerVmJob(job: any): Observable<any> {
    return this.asyncJobService.queryJob(job, this.entity, this.entityModel);
  }

  public getListOfVmsThatUseIso(iso: Iso): Observable<Array<VirtualMachine>> {
    return this.getListWithDetails()
      .map(vmList => vmList.filter(vm => vm.isoId === iso.id));
  }

  public addIpToNic(nicId: string, ipAddress?: string): Observable<any> {
    return this.sendCommand('addIpTo', { nicId, ipAddress }, 'Nic')
      .switchMap(job => this.asyncJobService.queryJob(job.jobid));
  }

  public removeIpFromNic(ipId: string): Observable<any> {
    return this.sendCommand('removeIpFrom', { id: ipId }, 'Nic')
      .switchMap(job => this.asyncJobService.queryJob(job.jobid));
  }

  public changeServiceOffering(
    serviceOffering: ServiceOffering,
    virtualMachine: VirtualMachine
  ): Observable<VirtualMachine> {
    const params = {};

    params['id'] = virtualMachine.id;
    params['serviceOfferingId'] = serviceOffering.id;

    if (serviceOffering.isCustomized) {
      params['details'] = [{
        cpuNumber: serviceOffering.cpuNumber,
        cpuSpeed: serviceOffering.cpuSpeed,
        memory: serviceOffering.memory
      }];
    }

    return this.sendCommand('changeServiceFor', params)
      .map(result => this.prepareModel(result['virtualmachine']))
      .do(result => this.updateVmInfo(result));
  }

  public setStateForVm(vm: VirtualMachine, state: VmState): void {
    vm.state = state;
  }

  private buildCommandParams(id: string, commandName: string): any {
    const params = {};

    if (commandName === 'restore') {
      params['virtualMachineId'] = id;
    } else if (commandName !== 'deploy') {
      params['id'] = id;
    }

    return params;
  }

  private addVolumes(vm: VirtualMachine, volumes: Array<Volume>): VirtualMachine {
    const filteredVolumes = volumes.filter((volume: Volume) => volume.virtualMachineId === vm.id);
    vm.volumes = this.sortVolumes(filteredVolumes);
    return vm;
  }

  private sortVolumes(volumes: Array<Volume>): Array<Volume> {
    return volumes.sort((a: Volume, b) => {
      const aIsRoot = a.type === 'ROOT';
      const bIsRoot = b.type === 'ROOT';
      if (aIsRoot && !bIsRoot) {
        return -1;
      }
      if (!aIsRoot && bIsRoot) {
        return 1;
      }
      return 0;
    });
  }

  private addOsType(vm: VirtualMachine, osTypes: Array<OsType>): VirtualMachine {
    vm.osType = osTypes.find((osType: OsType) => osType.id === vm.guestOsId);
    return vm;
  }

  private addServiceOffering(vm: VirtualMachine, offerings: Array<ServiceOffering>): VirtualMachine {
    vm.serviceOffering = offerings.find((serviceOffering: ServiceOffering) => {
      return serviceOffering.id === vm.serviceOfferingId;
    });
    return vm;
  }

  private addSecurityGroups(vm: VirtualMachine, groups: Array<SecurityGroup>): VirtualMachine {
    vm.securityGroup.forEach((group, index) => {
      vm.securityGroup[index] = groups.find(sg => sg.id === group.id);
    });
    return vm;
  }
}
