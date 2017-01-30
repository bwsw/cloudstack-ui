import { Injectable } from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';
import { Observable, Subject } from 'rxjs/Rx';

import { BaseBackendService, BACKEND_API_URL } from '../shared/services';
import { BackendResource } from '../shared/decorators';
import { VirtualMachine } from './vm.model';
import { VolumeService } from '../shared/services/volume.service';
import { Volume } from '../shared/models/volume.model';
import { OsTypeService } from '../shared/services/os-type.service';
import { OsType } from '../shared/models/os-type.model';

import { AsyncJob } from '../shared/models/async-job.model';
import { AsyncJobService } from '../shared/services/async-job.service';
import { SecurityGroupService } from '../shared/services/security-group.service';
import { ServiceOfferingService } from '../shared/services/service-offering.service';
import { ServiceOffering } from '../shared/models/service-offering.model';


@Injectable()
@BackendResource({
  entity: 'VirtualMachine',
  entityModel: VirtualMachine
})
export class VmService extends BaseBackendService<VirtualMachine> {
  public vmUpdateObservable: Subject<VirtualMachine>;

  constructor(
    private volumeService: VolumeService,
    private osTypesService: OsTypeService,
    private serviceOfferingService: ServiceOfferingService,
    private securityGroupService: SecurityGroupService,
    protected http: Http,
    protected jobs: AsyncJobService
  ) {
    super();
    this.vmUpdateObservable = new Subject<VirtualMachine>();
  }

  public updateVmInfo(vm: VirtualMachine): void {
    this.vmUpdateObservable.next(vm);
  }

  public get(id: string): Observable<VirtualMachine> {
    const volumesRequest = this.volumeService.getList();
    const vmRequest = super.get(id);

    return Observable.forkJoin([
      vmRequest,
      volumesRequest
    ]).map(result => {
        let vm = result[0];
        let volumes = result[1];
        vm.volumes = volumes.filter((volume: Volume) => volume.virtualMachineId === vm.id);

        const osTypeRequest = this.osTypesService.get(vm.guestOsId);
        const serviceOfferingRequest = this.serviceOfferingService.get(vm.serviceOfferingId);

        return [Observable.of(vm), osTypeRequest, serviceOfferingRequest];
    }).switchMap(result => Observable.forkJoin(result))
      .map(result => {
        let vm = result[0];
        vm.osType = result[1];
        vm.serviceOffering = result[2];
        return vm;
      });
  }

  public getList(lite = false, params?: {}): Observable<Array<VirtualMachine>> {
    const vmsRequest = super.getList();

    if (lite) {
      return <Observable<Array<VirtualMachine>>>vmsRequest;
    }

    const volumesRequest = this.volumeService.getList();
    const osTypesRequest = this.osTypesService.getList();
    const serviceOfferingsRequest = this.serviceOfferingService.getList();
    const securityGroupsRequest = this.securityGroupService.getList();

    return Observable.forkJoin([
      vmsRequest,
      volumesRequest,
      osTypesRequest,
      serviceOfferingsRequest,
      securityGroupsRequest
    ])
      .map(([vms, volumes, osTypes, serviceOfferings, securityGroups]) => {
        vms.forEach((vm: VirtualMachine) => {
          vm.volumes = volumes.filter((volume: Volume) => volume.virtualMachineId === vm.id);
          vm.osType = osTypes.find((osType: OsType) => osType.id === vm.guestOsId);
          vm.serviceOffering = serviceOfferings.find((serviceOffering: ServiceOffering) => {
            return serviceOffering.id === vm.serviceOfferingId;
          });
          vm.securityGroup.forEach((group, index) => {
            vm.securityGroup[index] = securityGroups.find(sg => sg.id === group.id);
          });
        });
        return vms;
      });
  }

  public deploy(params: {}): Observable<any> {
    return this.getRequest('deploy', params)
      .map(result => result['deployvirtualmachineresponse']);
  }

  public checkCommand(jobId: string): Observable<any> {
    let job = this.jobs.addJob(jobId)
      .map(result => {
        if (result && result.jobResultCode === 0 && result.jobResult) {
          result.jobResult = new this.entityModel(result.jobResult.virtualmachine);
        }
        this.jobs.event.next(result);
        return result;
      });
    job.subscribe();
    return job;
  }

  public resubscribe(): Observable<Array<Observable<AsyncJob>>> {
    return this.jobs.getList().map(jobs => {
      let filteredJobs = jobs.filter(job => !job.jobStatus && job.cmd);
      let observables = [];
      filteredJobs.forEach(job => {
        observables.push(this.checkCommand(job.jobId));
      });
      return observables;
    });
  }

  public changeServiceOffering(serviceOfferingId: string, id: string): Observable<VirtualMachine> {
    const command = 'changeServiceFor';
    let params = {};
    params['id'] = id;
    params['serviceofferingid'] = serviceOfferingId;

    return this.getRequest(command, params)
      .map(result => {
        return new this.entityModel(result['changeserviceforvirtualmachineresponse'].virtualmachine);
      });
  }

  public command(command: string, id?: string, params?: {}): Observable<AsyncJob> {
    let updatedParams = params ? params : {};

    if (command === 'restore') {
      updatedParams['virtualmachineid'] = id;
    } else if (command !== 'deploy') {
      updatedParams['id'] = id;
    }

    return this.getRequest(command, updatedParams)
      .map(result => {
        let fix;
        if (command === 'restore') {
          fix = 'vm';
        } else if (command === 'resetPasswordFor') {
          command = command.toLowerCase();
          fix = 'virtualmachine';
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

