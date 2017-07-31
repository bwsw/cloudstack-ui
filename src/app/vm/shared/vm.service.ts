import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { SecurityGroup } from '../../security-group/sg.model';

import { BackendResource } from '../../shared/decorators';

import { AsyncJob, Color, OsType, ServiceOffering, Volume } from '../../shared/models';

import {
  AsyncJobService,
  BaseBackendService,
  JobsNotificationService,
  NotificationService,
  OsTypeService,
} from '../../shared/services';

import { Iso } from '../../template/shared';
import { IVmAction, VirtualMachine, VmActions, VmStates } from './vm.model';
import { DialogService } from '../../dialog/dialog-module/dialog.service';
import { ServiceOfferingService } from '../../shared/services/service-offering.service';
import { SecurityGroupService } from '../../shared/services/security-group.service';
import { TagService } from '../../shared/services/tag.service';
import { UserService } from '../../shared/services/user.service';
import { VolumeService } from '../../shared/services/volume.service';
import { InstanceGroup } from '../../shared/models/instance-group.model';
import { VolumeTypes } from '../../shared/models/volume.model';


export interface IVmActionEvent {
  action: IVmAction;
  vm: VirtualMachine;
  templateId?: string;
}

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
    private dialogService: DialogService,
    private jobsNotificationService: JobsNotificationService,
    private notificationService: NotificationService,
    private osTypesService: OsTypeService,
    private serviceOfferingService: ServiceOfferingService,
    private securityGroupService: SecurityGroupService,
    private tagService: TagService,
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

        return this.getListWithDetails({}, true)
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

  public getWithDetails(id: string): Observable<VirtualMachine> {
    return this.getListWithDetails().map(list =>
      list.find(vm => vm.id === id)
    );
  }

  public getListWithDetails(params?: {}, lite = false): Observable<Array<VirtualMachine>> {
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
    return this.getListWithDetails()
      .map(vmList => vmList.reduce((groups, vm) => {
        const group = vm.tags.find(tag => tag.key === 'group');

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

  public vmAction(e: IVmActionEvent): Observable<void> {
    switch (e.action.commandName) {
      case VmActions.RESET_PASSWORD: return this.resetPassword(e);
      case VmActions.DESTROY: return this.destroy(e);
    }
    return this.command(e);
  }

  public command(e: IVmActionEvent): Observable<any> {
    const notificationId = this.jobsNotificationService.add(e.action.progressMessage);
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

  public destroy(e: IVmActionEvent): Observable<void> {
    return this.destroyVolumeDeleteConfirmDialog(e.vm)
      .switchMap(() => {
        return this.command(e).map(vm => {
          if (vm && vm.state === VmStates.Destroyed) {
            e.vm.volumes
              .filter(volume => volume.type === VolumeTypes.DATADISK)
              .forEach(volume =>
                this.volumeService.markForDeletion(volume.id).subscribe()
              );
            e.vm.securityGroup.forEach(sg =>
              this.securityGroupService.markForDeletion(sg.id).subscribe()
            );
          }
        });
      })
      .catch(() => this.command(e));
  }

  public resetPassword(e: IVmActionEvent): Observable<void> {
    const showDialog = (vmName: string, vmPassword: string) => {
      this.dialogService.customAlert({
        message: {
          translationToken: 'PASSWORD_DIALOG_MESSAGE',
          interpolateParams: { vmName, vmPassword }
        },
        width: '400px',
        clickOutsideToClose: false
      } as any);
    };

    if (e.vm.state === VmStates.Stopped) {
      this.command(e)
        .subscribe((vm: VirtualMachine) => {
          if (vm && vm.password) {
            showDialog(vm.displayName, vm.password);
          }
        });
    } else {
      const stop: IVmActionEvent = {
        action: VirtualMachine.getAction(VmActions.STOP),
        vm: e.vm,
        templateId: e.templateId
      };
      const start: IVmActionEvent = {
        action: VirtualMachine.getAction(VmActions.START),
        vm: e.vm,
        templateId: e.templateId
      };

      return this.command(stop)
        .switchMap(() => this.command(e))
        .map((vm: VirtualMachine) => {
          if (vm && vm.password) {
            showDialog(vm.displayName, vm.password);
          }
        })
        .switchMap(() => this.command(start))
    }
  }

  public registerVmJob(job: any): Observable<any> {
    return this.asyncJobService.queryJob(job, this.entity, this.entityModel);
  }

  public getListOfVmsThatUseIso(iso: Iso): Observable<Array<VirtualMachine>> {
    return this.getListWithDetails()
      .map(vmList => vmList.filter(vm => vm.isoId === iso.id));
  }

  public changeServiceOffering(
    serviceOffering: ServiceOffering,
    virtualMachine: VirtualMachine
  ): Observable<VirtualMachine> {
    if (virtualMachine.serviceOfferingId === serviceOffering.id) {
      return Observable.of(virtualMachine);
    }

    if (virtualMachine.state === VmStates.Stopped) {
      return this.changeOffering(serviceOffering, virtualMachine).map(vm => vm);
    }
    return this.command({
      action: VirtualMachine.getAction(VmActions.STOP),
      vm: virtualMachine
    }).switchMap(() => {
      return this.changeOffering(serviceOffering, virtualMachine).map(vm => vm);
    }).switchMap((vm) => {
      return this.command({
        action: VirtualMachine.getAction(VmActions.START),
        vm: virtualMachine
      }).map(() => vm);
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

  public setColor(vm: VirtualMachine, color: Color): Observable<VirtualMachine> {
    let tagValue = color.value;
    if (color.textColor) {
      tagValue += `${VirtualMachine.ColorDelimiter}${color.textColor}`;
    }
    return this.tagService.update(vm, 'UserVm', 'color', tagValue);
  }

  public getDescription(vm: VirtualMachine): Observable<string> {
    return this.tagService.getTag(vm, 'description')
      .map(tag => {
        return tag ? tag.value : undefined;
      });
  }

  public updateDescription(vm: VirtualMachine, description: string): Observable<void> {
    return this.tagService.update(vm, 'UserVm', 'description', description);
  }

  private changeOffering(serviceOffering: ServiceOffering, virtualMachine: VirtualMachine): Observable<VirtualMachine> {
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
      .map(result => {
        this.jobsNotificationService.finish({ message: 'OFFERING_CHANGED' });
        this.updateVmInfo(result);
        return result;
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

  private writeNumberOfVms(number: number): Observable<number> {
    return this.userService
      .writeTag('numberOfVms', number.toString())
      .mapTo(number);
  }
}
