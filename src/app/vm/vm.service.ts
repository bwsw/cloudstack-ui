import { Injectable } from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';
import { Observable, Subject } from 'rxjs/Rx';

import { BaseBackendService, BACKEND_API_URL } from '../shared/services';
import { BackendResource } from '../shared/decorators';
import { VirtualMachine, IVmAction } from './vm.model';
import { VolumeService } from '../shared/services/volume.service';
import { Volume } from '../shared/models/volume.model';
import { OsTypeService } from '../shared/services/os-type.service';
import { OsType } from '../shared/models/os-type.model';

import { AsyncJob } from '../shared/models/async-job.model';
import { AsyncJobService } from '../shared/services/async-job.service';
import { SecurityGroupService } from '../shared/services/security-group.service';
import { ServiceOfferingService } from '../shared/services/service-offering.service';
import { ServiceOffering } from '../shared/models/service-offering.model';
import { TranslateService } from 'ng2-translate';
import { MdlDialogService } from 'angular2-mdl';
import { INotificationStatus, JobsNotificationService } from '../shared/services/jobs-notification.service';
import { NotificationService } from '../shared/services/notification.service';


export interface IVmActionEvent {
  id: string;
  action: IVmAction;
  vm: VirtualMachine;
  templateId?: string;
}

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
    private translateService: TranslateService,
    private dialogService: MdlDialogService,
    private jobsNotificationService: JobsNotificationService,
    private notificationService: NotificationService,
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

  public checkCommand(jobId: string): Observable<any> {
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
      let filteredJobs = jobs.filter(job => !job.jobStatus && job.cmd);
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

  public vmAction(e: IVmActionEvent): void {
    this.translateService.get([
      'YES',
      'NO',
      e.action.confirmMessage
    ]).switchMap((strs) => {
      return this.dialogService.confirm(strs[e.action.confirmMessage], strs.NO, strs.YES);
    }).subscribe(() => {
        if (e.action.commandName !== 'resetPasswordFor') {
          this.singleActionCommand(e).subscribe();
        } else {
          this.resetPassword(e);
        }
      },
      () => {});
  }

  public singleActionCommand(e: IVmActionEvent): Observable<any> {
    let id;
    let strs;
    return this.translateService.get([
      e.action.progressMessage,
      e.action.successMessage
    ]).switchMap((res) => {
      strs = res;
      id = this.jobsNotificationService.add(strs[e.action.progressMessage]);
      if (e.vm) {
        e.vm.state = e.action.vmStateOnAction;
      }
      return this.command(e.action.commandName, e.vm.id);
    }).map(() => {
      this.jobsNotificationService.add({
        id,
        message: strs[e.action.successMessage],
        status: INotificationStatus.Finished
      });
    });
  }

  public resetPassword(e: IVmActionEvent) {
    if (e.vm.state === 'Stopped') {
      this.singleActionCommand(e).subscribe();
    } else {
      let stop: IVmActionEvent = {
        id: e.id,
        action: VirtualMachine.getAction('stop'),
        vm: e.vm,
        templateId: e.templateId
      };
      let start: IVmActionEvent = {
        id: e.id,
        action: VirtualMachine.getAction('start'),
        vm: e.vm,
        templateId: e.templateId
      };

      this.singleActionCommand(stop)
        .switchMap(() => this.singleActionCommand(e))
        .switchMap(() => this.singleActionCommand(start))
        .subscribe();
    }
  }

  public changeServiceOffering(serviceOfferingId: string, virtualMachine: VirtualMachine) {
    if (virtualMachine.serviceOfferingId === serviceOfferingId) {
      return;
    }
    if (virtualMachine.state === 'Stopped') {
      this._changeServiceOffering(serviceOfferingId, virtualMachine).subscribe();
    } else {
      this.singleActionCommand({
        id: virtualMachine.id,
        action: VirtualMachine.getAction('stop'),
        vm: virtualMachine
      }).switchMap(() => {
        return this._changeServiceOffering(serviceOfferingId, virtualMachine);
      }).subscribe(() => {
        this.singleActionCommand({
          id: virtualMachine.id,
          action: VirtualMachine.getAction('start'),
          vm: virtualMachine
        }).subscribe();
      });
    }
  }

  private _changeServiceOffering(serviceOfferingId: string, virtualMachine: VirtualMachine) {
    const urlParams = new URLSearchParams();
    const command = 'changeServiceForVirtualMachine';

    urlParams.append('command', command);
    urlParams.append('response', 'json');
    urlParams.append('id', virtualMachine.id);
    urlParams.append('serviceofferingid', serviceOfferingId);

    return this.translateService.get([
      'OFFERING_CHANGED',
      'OFFERING_CHANGE_FAILED',
      'UNEXPECTED_ERROR'
    ]).switchMap(strs => {

      return this.http.get(BACKEND_API_URL, { search: urlParams })
        .map(result => {
          return new this.entityModel(result.json()[command.toLowerCase() + 'response'].virtualmachine);
        })
        .map(result => {
          this.jobsNotificationService.add({
            message: strs['OFFERING_CHANGED'],
            status: INotificationStatus.Finished
          });
          this.updateVmInfo(result);
        }, () => {
          this.jobsNotificationService.add({
            message: strs['OFFERING_CHANGE_FAILED'],
            status: INotificationStatus.Failed
          });
          this.notificationService.error(strs['UNEXPECTED_ERROR']);
        });
    });
  }
}

