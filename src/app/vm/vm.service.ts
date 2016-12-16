import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseBackendService, BACKEND_API_URL } from '../shared/services';
import { BackendResource } from '../shared/decorators';
import { VirtualMachine } from './vm.model';
import { VolumeService } from '../shared/services/volume.service';
import { Volume } from '../shared/models/volume.model';
import { OsTypeService } from '../shared/services/os-type.service';
import { OsType } from '../shared/models/os-type.model';

import { AsyncJob } from '../shared/models/async-job.model';
import { AsyncJobService } from '../shared/services/async-job.service';
import { Http, URLSearchParams } from '@angular/http';


@Injectable()
@BackendResource({
  entity: 'VirtualMachine',
  entityModel: VirtualMachine
})
export class VmService extends BaseBackendService<VirtualMachine> {
  constructor(
    private volumeService: VolumeService,
    private osTypesService: OsTypeService,
    protected http: Http,
    protected jobs: AsyncJobService
  ) {
    super();
  }

  public startVM(id: string): Observable<AsyncJob> {
    return this.command(id, 'start');
  }

  public stopVM(id: string): Observable<AsyncJob> {
    return this.command(id, 'stop');
  }


  public get(id: string): Promise<VirtualMachine> {
    const volumesRequest = this.volumeService.getList();
    const vmRequest = super.get(id);

    return Promise.all([vmRequest, volumesRequest])
      .then(([vm, volumes]) => {
        vm.volumes = volumes.filter((volume: Volume) => volume.virtualMachineId === vm.id);

        const osTypeRequest = this.osTypesService.get(vm.guestOsId);
        return Promise.all([Promise.resolve(vm), osTypeRequest]);
      })
      .then(([vm, osType]) => {
        vm.osType = osType;
        return vm;
      });
  }

  public getList(params?: {}): Promise<Array<VirtualMachine>> {
    const vmsRequest = super.getList();
    const volumesRequest = this.volumeService.getList();
    const osTypesRequest = this.osTypesService.getList();

    return Promise.all([vmsRequest, volumesRequest, osTypesRequest])
      .then(([vms, volumes, osTypes]) => {
        vms.forEach((vm: VirtualMachine) => {
          vm.volumes = volumes.filter((volume: Volume) => volume.virtualMachineId === vm.id);
          vm.osType = osTypes.find((osType: OsType) => osType.id === vm.guestOsId);
        });
        return vms;
    });
  }

  private command(id: string, command: string): Observable<AsyncJob> {
    const urlParams = new URLSearchParams();

    urlParams.append('command', command + 'VirtualMachine');
    urlParams.append('id', id);
    urlParams.append('response', 'json');

    return this.http.get(BACKEND_API_URL, { search: urlParams })
      .map(result => result.json())
      .map(result => result[command + 'virtualmachineresponse'].jobid)
      .switchMap(result => this.jobs.addJob(result))
      .map(result => {
        if (result.jobResultCode === 0) {
          result.jobResult = new this.entityModel(result.jobResult.virtualmachine);
        }
        return result;
      });
  }
}
