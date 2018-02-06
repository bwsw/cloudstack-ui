import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BackendResource } from '../../shared/decorators';
import { OsType, ServiceOffering, Volume } from '../../shared/models';
import { VolumeType } from '../../shared/models/volume.model';
import { AsyncJobService } from '../../shared/services/async-job.service';
import { BaseBackendService } from '../../shared/services/base-backend.service';
import { OsTypeService } from '../../shared/services/os-type.service';
import { UserTagService } from '../../shared/services/tags/user-tag.service';
import { VolumeService } from '../../shared/services/volume.service';
import { Iso } from '../../template/shared';
import { VirtualMachine } from './vm.model';


export const VirtualMachineEntityName = 'VirtualMachine';

@Injectable()
@BackendResource({
  entity: VirtualMachineEntityName,
  entityModel: VirtualMachine
})
export class VmService extends BaseBackendService<VirtualMachine> {

  constructor(
    private asyncJobService: AsyncJobService,
    private osTypesService: OsTypeService,
    private userTagService: UserTagService,
    private volumeService: VolumeService,
    http: HttpClient
  ) {
    super(http);
  }

  public getNumberOfVms(): Observable<number> {
    return this.userTagService.getLastVmId()
      .switchMap(numberOfVms => {
        if (numberOfVms !== undefined && !Number.isNaN(+numberOfVms)) {
          return Observable.of(+numberOfVms);
        }

        return this.getListWithDetails(undefined, true)
          .switchMap(vmList => this.userTagService.setLastVmId(vmList.length));
      });
  }

  public incrementNumberOfVms(): Observable<number> {
    return this.getNumberOfVms()
      .switchMap(numberOfVms => this.userTagService.setLastVmId(numberOfVms + 1));
  }

  public getWithDetails(id: string): Observable<VirtualMachine> {
    return this.getListWithDetails().map(list =>
      list.find(vm => vm.id === id)
    );
  }

  public getListWithDetails(
    params?: {},
    lite = false
  ): Observable<Array<VirtualMachine>> {
    if (lite) {
      return this.getList(params);
    }

    return Observable.forkJoin(
      this.getList(params),
      this.volumeService.getList(),
      this.osTypesService.getList()
    )
      .map(([vmList, volumes, osTypes]) => {
        vmList.forEach((currentVm, index, vms) => {
          currentVm = this.addVolumes(currentVm, volumes);
          currentVm = this.addOsType(currentVm, osTypes);
          vms[index] = currentVm;
        });
        return vmList;
      });
  }

  public deploy(params: {}): Observable<any> {
    return this.sendCommand('deploy', params);
  }

/*   public resubscribe(): Observable<Array<Observable<AsyncJob<VirtualMachine>>>> {
     return this.asyncJobService.getList().map(jobs => {
       return jobs.filter(job => !job.jobstatus && mapCmd(job))
         .map(job => this.registerVmJob(job));
     });
   }*/


  public command(
    vm: VirtualMachine,
    command: string,
    params?: {}
  ): Observable<VirtualMachine> {
    return this.commandInternal(vm, command, params)
      .switchMap(job => this.registerVmJob(job))
      .do(jogResult => jogResult)
      .catch(error => {
        return Observable.throw(error);
      });
  }

  public commandSync(
    vm: VirtualMachine,
    command: string,
    params?: {}
  ): Observable<any> {

    return this.commandInternal(vm, command, params)
      .do((res) => res)
      .catch(error => {
        return Observable.throw(error);
      });
  }

  public registerVmJob(job: any): Observable<any> {
    return this.asyncJobService.queryJob(job, this.entity, this.entityModel);
  }

  public getListOfVmsThatUseIso(iso: Iso): Observable<Array<VirtualMachine>> {
    return this.getListWithDetails()
      .map(vmList => vmList.filter(vm => vm.isoId === iso.id));
  }

  public addIpToNic(nicId: string): Observable<any> {
    return this.sendCommand('addIpTo', { nicId }, 'Nic')
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

    if (serviceOffering.iscustomized) {
      params['details'] = [
        {
          cpuNumber: serviceOffering.cpunumber,
          cpuSpeed: serviceOffering.cpuspeed,
          memory: serviceOffering.memory
        }
      ];
    }

    return this.sendCommand('changeServiceFor', params)
      .map(result => this.prepareModel(result['virtualmachine']));
  }

  /*public isAsyncJobAVirtualMachineJobWithResult(job: AsyncJob<any>): boolean {
    // instanceof check is needed because API response for
    // VM restore doesn't contain the jobinstancetype field

    return (
      job.jobresult &&
      (job.jobinstancetype === VirtualMachineEntityName ||
        job.jobresult instanceof VirtualMachine)
    );
  }*/

  private commandInternal(
    vm: VirtualMachine,
    command: string,
    params?: {}
  ): Observable<any> {
    const commandName = command;

    return this.sendCommand(
      commandName,
      this.buildCommandParams(vm.id, commandName, params)
    );
  }

  private buildCommandParams(id: string, commandName: string, params?: {}): any {
    const requestParams = params ? Object.assign({}, params) : {};

    if (commandName === 'restore') {
      requestParams['virtualMachineId'] = id;
    } else if (commandName !== 'deploy') {
      requestParams['id'] = id;
    }

    return requestParams;
  }

  private addVolumes(vm: VirtualMachine, volumes: Array<Volume>): VirtualMachine {
    const filteredVolumes = volumes.filter((volume: Volume) => volume.virtualmachineid === vm.id);
    vm.volumes = this.sortVolumes(filteredVolumes);
    return vm;
  }

  private sortVolumes(volumes: Array<Volume>): Array<Volume> {
    return volumes.sort((a: Volume, b) => {
      const aIsRoot = a.type === VolumeType.ROOT;
      const bIsRoot = b.type === VolumeType.ROOT;
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
}
