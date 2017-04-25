import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

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
import { InstanceGroup } from '../../shared/models/instance-group.model';
import { VolumeTypes } from '../../shared/models/volume.model';
import { DialogService } from '../../shared/services/dialog.service';
import { UserService } from '../../shared/services/user.service';


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
    private dialogService: DialogService,
    private jobsNotificationService: JobsNotificationService,
    private notificationService: NotificationService,
    private osTypesService: OsTypeService,
    private serviceOfferingService: ServiceOfferingService,
    private securityGroupService: SecurityGroupService,
    private userService: UserService,
    private volumeService: VolumeService
  ) {
    super();
  }

  public getNumberOfVms(): Observable<number> {
    return this.userService.readTag('numberOfVms')
      .switchMap(numberOfVms => {
        if (numberOfVms !== undefined && !Number.isNaN(+numberOfVms)) {
          return Observable.of(+numberOfVms);
        }

        return this.getList({}, true)
          .switchMap(vmList => {
            return this.writeNumberOfVms(vmList.length);
          });
      });
  }

  public incrementNumberOfVms(): Observable<number> {
    return this.getNumberOfVms()
      .switchMap(numberOfVms => this.writeNumberOfVms(numberOfVms + 1));
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
          vm.securityGroup[0] ? this.securityGroupService.get(vm.securityGroup[0].id) : Observable.of(null)
        ]);
      })
      .map(([virtualMachine, osType, serviceOffering, securityGroup]) => {
        let vm = virtualMachine;
        vm.osType = osType;
        vm.serviceOffering = serviceOffering;
        if (securityGroup) {
          vm.securityGroup[0] = securityGroup;
        }
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

  public getInstanceGroupList(): Observable<Array<InstanceGroup>> {
    return this.getList()
      .map(vmList => vmList.reduce((groups, vm) => {
        let group = vm.tags.find(tag => tag.key === 'group');

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
      let filteredJobs = jobs.filter(job => !job.status && job.cmd);
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
    let notificationId = this.jobsNotificationService.add(e.action.progressMessage);
    if (e.vm) {
      e.vm.state = e.action.vmStateOnAction as any;
    }
    return this.sendCommand(e.action.commandName, this.buildCommandParams(e.vm.id, e.action.commandName))
      .switchMap(job => this.registerVmJob(job))
      .map(job => {
        this.jobsNotificationService.finish({
          id: notificationId,
          message: e.action.successMessage
        });
        return job;
      });
  }

  public destroy(e: IVmActionEvent): void {
    this.destroyVolumeDeleteConfirmDialog(e.vm).subscribe(
      () => {
        this.command(e).subscribe(vm => {
          if (vm && vm.state === 'Destroyed') {
            e.vm.volumes
              .filter(volume => volume.type === VolumeTypes.DATADISK)
              .forEach(volume => this.volumeService.markForDeletion(volume.id).subscribe());
            e.vm.securityGroup.forEach(sg => this.securityGroupService.markForDeletion(sg.id).subscribe());
          }
        });
      },
      () => this.command(e).subscribe()
    );
  }

  public resetPassword(e: IVmActionEvent): void {
    let showDialog = (displayName: string, password: string) => {
      this.dialogService.alert({
        translationToken: 'PASSWORD_DIALOG_MESSAGE',
        interpolateParams: { vmName: displayName, vmPassword: password }
      } as any);
    };

    if (e.vm.state === 'Stopped') {
      this.command(e)
        .subscribe((vm: VirtualMachine) => {
          if (vm && vm.password) {
            showDialog(vm.displayName, vm.password);
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
        .map((vm: VirtualMachine) => {
          if (vm && vm.password) {
            showDialog(vm.displayName, vm.password);
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

  public changeServiceOffering(serviceOffering: ServiceOffering, virtualMachine: VirtualMachine): void {
    if (virtualMachine.serviceOfferingId === serviceOffering.id) {
      return;
    }

    if (virtualMachine.state === 'Stopped') {
      this.changeOffering(serviceOffering, virtualMachine).subscribe();
      return;
    }
    this.command({
      action: VirtualMachine.getAction('stop'),
      vm: virtualMachine
    })
      .switchMap(() => {
        return this.changeOffering(serviceOffering, virtualMachine);
      })
      .subscribe(() => {
        this.command({
          action: VirtualMachine.getAction('start'),
          vm: virtualMachine
        }).subscribe();
      });
  }

  public addIpToNic(nicId: string, ipAddress?: string): Observable<any> {
    return this.sendCommand('addIpTo', { nicId, ipAddress }, 'Nic')
      .switchMap(job => this.asyncJobService.queryJob(job.jobid));
  }

  public removeIpFromNic(ipId: string): Observable<any> {
    return this.sendCommand('removeIpFrom', { id: ipId }, 'Nic')
      .switchMap(job => this.asyncJobService.queryJob(job.jobid));
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

  private changeOffering(serviceOffering: ServiceOffering, virtualMachine: VirtualMachine): Observable<void> {
    let params = {};

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
      .map(result => {
        this.jobsNotificationService.finish({ message: 'OFFERING_CHANGED' });
        this.updateVmInfo(result);
      }, () => {
        this.jobsNotificationService.fail({ message: 'OFFERING_CHANGE_FAILED' });
        this.notificationService.error('UNEXPECTED_ERROR');
      });
  }

  private destroyVolumeDeleteConfirmDialog(vm: VirtualMachine): any {
    if (vm.volumes.length === 1) {
      return Observable.of(false);
    }
    return this.dialogService.confirm('CONFIRM_VM_DELETE_DRIVES', 'NO', 'YES');
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

  private writeNumberOfVms(number: number): Observable<number> {
    return this.userService
      .writeTag('numberOfVms', number.toString())
      .mapTo(number);
  }
}
