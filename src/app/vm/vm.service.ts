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
import { ServiceOfferingService } from '../shared/services/service-offering.service';
import { ServiceOffering } from '../shared/models/service-offering.model';


@Injectable()
@BackendResource({
  entity: 'VirtualMachine',
  entityModel: VirtualMachine
})
export class VmService extends BaseBackendService<VirtualMachine> {

  constructor(
    private volumeService: VolumeService,
    private osTypesService: OsTypeService,
    private serviceOfferingService: ServiceOfferingService,
    protected http: Http,
    protected jobs: AsyncJobService
  ) {
    super();
  }

  public get(id: string): Observable<VirtualMachine> {
    const volumesRequest = this.volumeService.getList();
    const vmRequest = super.get(id);

    return Observable.forkJoin([vmRequest, volumesRequest])
      .switchMap(([vm, volumes]) => {
        vm.volumes = volumes.filter((volume: Volume) => volume.virtualMachineId === vm.id);

        const osTypeRequest = this.osTypesService.get(vm.guestOsId);
        const serviceOfferingRequest = this.serviceOfferingService.get(vm.serviceOfferingId);
        return Observable.forkJoin([Observable.of(vm), osTypeRequest, serviceOfferingRequest]);
      })
      .switchMap(([vm, osType, serviceOffering]) => {
        vm.osType = osType;
        vm.serviceOffering = serviceOffering;
        return vm;
      });
  }

  public getList(lite = false, params?: {}): Observable<Array<VirtualMachine>> {
    const vmsRequest = super.getList();

    if (lite) {
      return vmsRequest;
    }

    const volumesRequest = this.volumeService.getList();
    const osTypesRequest = this.osTypesService.getList();
    const serviceOfferingsRequest = this.serviceOfferingService.getList();

    return Observable.forkJoin([
      vmsRequest,
      volumesRequest,
      osTypesRequest,
      serviceOfferingsRequest
    ])
      .map(([vms, volumes, osTypes, serviceOfferings]) => {
        vms.forEach((vm: VirtualMachine) => {
          vm.volumes = volumes.filter((volume: Volume) => volume.virtualMachineId === vm.id);
          vm.osType = osTypes.find((osType: OsType) => osType.id === vm.guestOsId);
          vm.serviceOffering = serviceOfferings.find((serviceOffering: ServiceOffering) => {
            return serviceOffering.id === vm.serviceOfferingId;
          });
        });
        return vms;
    });
  }

  public deploy(params: {}) {
    const urlParams = new URLSearchParams();
    urlParams.append('command', 'deployVirtualMachine');

    for (let key in params) {
      if (params.hasOwnProperty(key)) {
        urlParams.set(key, params[key]);
      }
    }

    return this.http.get(BACKEND_API_URL, {search: urlParams})
      .map(result => result.json().deployvirtualmachineresponse);
  }

  public checkCommand(jobId: string) {
    return this.jobs.addJob(jobId)
      .map(result => {
        if (result && result.jobResultCode === 0 && result.jobResult) {
          result.jobResult = new this.entityModel(result.jobResult.virtualmachine);
        }
        this.jobs.event.next(result);
        return result;
      });
  }

  public resubscribe(): Observable<Array<Observable<AsyncJob>>> {
    return this.jobs.getList().map(jobs => {
      const cmdRegex = /^org\.apache\.cloudstack\.api\.command\.user\.vm\.(\w*)VMCmd$/;
      let filteredJobs = jobs.filter(job => !job.jobStatus && cmdRegex.test(job.cmd));
      let observables = [];
      filteredJobs.forEach(job => {
        observables.push(this.checkCommand(job.jobId));
      });
      return observables;
    });
  }

  public command(command: string, id?: string, params?: {}): Observable<AsyncJob> {
    const urlParams = new URLSearchParams();

    urlParams.append('command', command + 'VirtualMachine');
    urlParams.append('response', 'json');
    if (command === 'restore') {
      urlParams.append('virtualmachineid', id);
    } else if (command !== 'deploy') {
      urlParams.append('id', id);
    }

    for (let p in params) {
      if (params.hasOwnProperty(p)) {
        urlParams.append(p, params[p]);
      }
    }
    return this.http.get(BACKEND_API_URL, { search: urlParams })
      .map(result => result.json())
      .map(result => {
        let fix;
        if (command === 'restore') {
          fix = 'vm';
        } else {
          fix = 'virtualmachine';
        }
        return result[command + fix + 'response'].jobid;
      })
      .switchMap(result => this.jobs.addJob(result))
      .map(result => {
        if (result && result.jobResultCode === 0) {
          result.jobResult = new this.entityModel(result.jobResult.virtualmachine);
        }
        this.jobs.event.next(result);
        return result;
      });
  }
}
