import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx';

import { BaseBackendService } from '../../shared/services';
import { BackendResource } from '../../shared/decorators';
import { VirtualMachine, IVmAction } from './vm.model';

import { TranslateService } from 'ng2-translate';
import { MdlDialogService } from 'angular2-mdl';

import {
  AsyncJob,
  OsType,
  ServiceOffering,
  Volume
} from '../../shared/models';

import {
  AsyncJobService,
  NotificationService,
  OsTypeService
} from '../../shared/services';

import { INotificationStatus, JobsNotificationService } from '../../shared/services/jobs-notification.service';

import { SecurityGroupService } from '../../shared/services/security-group.service';
import { ServiceOfferingService } from '../../shared/services/service-offering.service';
import { VolumeService } from '../../shared/services/volume.service';


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
      const securityGroupRequest = this.securityGroupService.get(vm.securityGroup[0].id);

      return [
        Observable.of(vm),
        osTypeRequest,
        serviceOfferingRequest,
        securityGroupRequest
      ];
    })
      .switchMap(result => Observable.forkJoin(result))
      .map(result => {
        let vm = result[0];
        vm.osType = result[1];
        vm.serviceOffering = result[2];
        vm.securityGroup[0] = result[3];
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

          vm.volumes.sort((a: Volume, b) => {
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
    let updatedParams = params ? params : {};

    if (command === 'restore') {
      updatedParams['virtualmachineid'] = id;
    } else if (command !== 'deploy') {
      updatedParams['id'] = id;
    }

    return this.getRequest(command, updatedParams)
      .map(result => {
        let fix = 'virtualmachine';
        if (command === 'restore') {
          fix = 'vm';
        } else if (command === 'resetPasswordFor') {
          command = command.toLowerCase();
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
    }).map(job => {
      this.jobsNotificationService.add({
        id,
        message: strs[e.action.successMessage],
        status: INotificationStatus.Finished
      });
      return job;
    });
  }

  public resetPassword(e: IVmActionEvent): void {
    let showDialog = (displayName: string, password: string) => {
      this.translateService.get('PASSWORD_DIALOG_MESSAGE',
        {
          vmName: displayName,
          vmPassword: password
        })
        .subscribe((res: string) => {
          this.dialogService.alert(res);
        });
    };

    if (e.vm.state === 'Stopped') {
      this.singleActionCommand(e)
      .subscribe((job: AsyncJob) => {
        if (job && job.jobResult && job.jobResult.password) {
          showDialog(job.jobResult.displayName, job.jobResult.password);
        }
      });
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
        .map((job: AsyncJob) => {
          if (job && job.jobResult && job.jobResult.password) {
             showDialog(job.jobResult.displayName, job.jobResult.password);
           }
        })
        .switchMap(() => this.singleActionCommand(start))
        .subscribe();
    }
  }

  public changeServiceOffering(serviceOfferingId: string, virtualMachine: VirtualMachine): void {
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

  private _changeServiceOffering(serviceOfferingId: string, virtualMachine: VirtualMachine): Observable<void> {
    const command = 'changeServiceForVirtualMachine';
    let params = {};
    let translatedStrings = [];

    params['command'] = command;
    params['id'] = virtualMachine.id;
    params['serviceofferingid'] = serviceOfferingId;

    return this.translateService.get([
      'OFFERING_CHANGED',
      'OFFERING_CHANGE_FAILED',
      'UNEXPECTED_ERROR'
    ]).switchMap(strs => {
      translatedStrings = strs;
      return this.getRequest(command, params);
    })
      .map(result => {
        return new this.entityModel(result[command.toLowerCase() + 'response'].virtualmachine);
      })
      .map(result => {
        this.jobsNotificationService.add({
          message: translatedStrings['OFFERING_CHANGED'],
          status: INotificationStatus.Finished
        });
        this.updateVmInfo(result);
      }, () => {
        this.jobsNotificationService.add({
          message: translatedStrings['OFFERING_CHANGE_FAILED'],
          status: INotificationStatus.Failed
        });
        this.notificationService.error(translatedStrings['UNEXPECTED_ERROR']);
      });
  }
}

