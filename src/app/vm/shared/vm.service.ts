import { Injectable } from '@angular/core';
import { MdlDialogService } from 'angular2-mdl';
import { TranslateService } from 'ng2-translate';
import { Observable, Subject } from 'rxjs/Rx';

import { BackendResource } from '../../shared/decorators';

import {
  AsyncJob,
  Color,
  OsType,
  ServiceOffering,
  Volume
} from '../../shared/models';

import {
  AsyncJobService,
  BaseBackendService,
  INotificationStatus,
  JobsNotificationService,
  NotificationService,
} from '../../shared/services';

import { OsTypeService } from '../../shared/services/os-type.service';
import { SecurityGroupService } from '../../shared/services/security-group.service';
import { VolumeService } from '../../shared/services/volume.service';
import { ServiceOfferingService } from '../../shared/services/service-offering.service';


import { Iso } from '../../template/shared/iso.model';
import { SecurityGroup } from '../../security-group/sg.model';
import { VirtualMachine, IVmAction } from './vm.model';


export interface IVmActionEvent {
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
  public vmUpdateObservable = new Subject<VirtualMachine>();

  constructor(
    private asyncJobService: AsyncJobService,
    private dialogService: MdlDialogService,
    private jobsNotificationService: JobsNotificationService,
    private notificationService: NotificationService,
    private osTypesService: OsTypeService,
    private serviceOfferingService: ServiceOfferingService,
    private securityGroupService: SecurityGroupService,
    private translateService: TranslateService,
    private volumeService: VolumeService,
  ) {
    super();
  }

  public updateVmInfo(vm: VirtualMachine): void {
    this.vmUpdateObservable.next(vm);
  }

  public get(id: string): Observable<VirtualMachine> {
    return Observable.forkJoin([
      super.get(id),
      this.volumeService.getList({
        virtualMachineId: id
      })
    ])
      .switchMap(([vm, volumes]) => {
        vm.volumes = this.sortVolumes(volumes);

        return Observable.forkJoin([
          Observable.of(vm),
          this.osTypesService.get(vm.guestOsId),
          this.serviceOfferingService.get(vm.serviceOfferingId),
          this.securityGroupService.get(vm.securityGroup[0].id)
        ]);
      })
      .map(([virtualMachine, osType, serviceOffering, securityGroup]) => {
        let vm = virtualMachine;
        vm.osType = osType;
        vm.serviceOffering = serviceOffering;
        vm.securityGroup[0] = securityGroup;
        return vm;
      });
  }

  public getList(params?: {}, lite = false): Observable<Array<VirtualMachine>> {
    if (lite) {
      return super.getList(params);
    }
    return Observable.forkJoin([
      super.getList(params),
      this.volumeService.getList(),
      this.osTypesService.getList(),
      this.serviceOfferingService.getList(),
      this.securityGroupService.getList()
    ])
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

  public deploy(params: {}): Observable<any> {
    return this.sendCommand('deploy', params);
  }

  public resubscribe(): Observable<Array<Observable<AsyncJob<VirtualMachine>>>> {
    return this.asyncJobService.getList().map(jobs => {
      let filteredJobs = jobs.filter(job => !job.jobStatus && job.cmd);
      let observables = [];
      filteredJobs.forEach(job => {
        observables.push(this.registerVmJob(job));
      });
      return observables;
    });
  }

  public vmAction(e: IVmActionEvent): void {
    switch (e.action.commandName) {
      case 'resetPasswordFor': return this.resetPassword(e);
      case 'destroy': return this.destroy(e);
    }
    if (e.action.commandName !== 'resetPasswordFor') {
      this.command(e).subscribe();
    } else {
      this.resetPassword(e);
    }
  }

  public command(e: IVmActionEvent): Observable<any> {
    let notificationId;
    let strs;
    return this.translateService.get([
      e.action.progressMessage,
      e.action.successMessage
    ])
      .switchMap(res => {
        strs = res;
        notificationId = this.jobsNotificationService.add(strs[e.action.progressMessage]);
        if (e.vm) {
          e.vm.state = e.action.vmStateOnAction;
        }
        return this.sendCommand(e.action.commandName, this.buildCommandParams(e.vm.id, e.action.commandName))
          .switchMap(job => this.registerVmJob(job));
      })
      .map(job => {
        this.jobsNotificationService.add({
          id: notificationId,
          message: strs[e.action.successMessage],
          status: INotificationStatus.Finished
        });
        return job;
      });
  }

  public destroy(e: IVmActionEvent): void {
    this.translateService.get(['CONFIRM_VM_DELETE_DRIVES', 'NO', 'YES'])
      .switchMap(strs => {
        return this.dialogService.confirm(
          strs['CONFIRM_VM_DELETE_DRIVES'],
          strs['NO'],
          strs['YES']
        );
      })
      .subscribe(
        () => {
          this.command(e).subscribe((job: AsyncJob<VirtualMachine>) => {
            if (job && job.jobResult && job.jobResult.state === 'Destroyed') {
              e.vm.volumes
                .filter(volume => volume.type === 'DATADISK')
                .forEach(volume => this.volumeService.markForDeletion(volume.id).subscribe());
            }
          });
        },
        () => {
          this.command(e).subscribe();
        }
      );
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
      this.command(e)
        .subscribe((job: AsyncJob<VirtualMachine>) => {
          if (job && job.jobResult && job.jobResult.password) {
            showDialog(job.jobResult.displayName, job.jobResult.password);
          }
        });
    } else {
      let stop: IVmActionEvent = {
        action: VirtualMachine.getAction('stop'),
        vm: e.vm,
        templateId: e.templateId
      };
      let start: IVmActionEvent = {
        action: VirtualMachine.getAction('start'),
        vm: e.vm,
        templateId: e.templateId
      };

      this.command(stop)
        .switchMap(() => this.command(e))
        .map((job: AsyncJob<VirtualMachine>) => {
          if (job && job.jobResult && job.jobResult.password) {
            showDialog(job.jobResult.displayName, job.jobResult.password);
          }
        })
        .switchMap(() => this.command(start))
        .subscribe();
    }
  }

  public registerVmJob(job: any): Observable<any> {
    return this.asyncJobService.queryJob(job, this.entity, this.entityModel);
  }

  public getListOfVmsThatUseIso(iso: Iso): Observable<Array<VirtualMachine>> {
    return this.getList()
      .map(vmList => vmList.filter(vm => vm.isoId === iso.id));
  }

  public changeServiceOffering(serviceOfferingId: string, virtualMachine: VirtualMachine): void {
    if (virtualMachine.serviceOfferingId === serviceOfferingId) {
      return;
    }

    if (virtualMachine.state === 'Stopped') {
      this._changeServiceOffering(serviceOfferingId, virtualMachine).subscribe();
      return;
    }
    this.command({
      action: VirtualMachine.getAction('stop'),
      vm: virtualMachine
    })
      .switchMap(() => {
        return this._changeServiceOffering(serviceOfferingId, virtualMachine);
      })
      .subscribe(() => {
        this.command({
          action: VirtualMachine.getAction('start'),
          vm: virtualMachine
        }).subscribe();
      });
  }

  public getColor(vm: VirtualMachine): Color {
    if (vm.tags) {
      let colorTag = vm.tags.find(tag => tag.key === 'color');
      if (colorTag) {
        return new Color(colorTag.value, colorTag.value);
      }
    }
    return new Color('white', '#FFFFFF');
  }

  private _changeServiceOffering(serviceOfferingId: string, virtualMachine: VirtualMachine): Observable<void> {
    const command = 'changeServiceFor';
    let params = {};
    let translatedStrings = [];

    params['id'] = virtualMachine.id;
    params['serviceOfferingId'] = serviceOfferingId;

    return this.translateService.get([
      'OFFERING_CHANGED',
      'OFFERING_CHANGE_FAILED',
      'UNEXPECTED_ERROR'
    ]).switchMap(strs => {
      translatedStrings = strs;
      return this.sendCommand(command, params);
    })
      .map(result => this.prepareModel(result['virtualmachine']))
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

  private buildCommandParams(id: string, commandName: string): any {
    let params = {};
    if (commandName === 'restore') {
      params['virtualMachineId'] = id;
    } else if (commandName !== 'deploy') {
      params['id'] = id;
    }
    return params;
  }

  private addVolumes(vm: VirtualMachine, volumes: Array<Volume>): VirtualMachine {
    let filteredVolumes = volumes.filter((volume: Volume) => volume.virtualMachineId === vm.id);
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
