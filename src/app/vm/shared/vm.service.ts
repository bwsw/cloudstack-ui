import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable, throwError } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

import { BackendResource } from '../../shared/decorators';
import { OsType, ServiceOffering, Volume, VolumeType } from '../../shared/models';
import { AsyncJobService } from '../../shared/services/async-job.service';
import { BaseBackendService, CSCommands } from '../../shared/services/base-backend.service';
import { OsTypeService } from '../../shared/services/os-type.service';
import { VolumeService } from '../../shared/services/volume.service';
import { Iso } from '../../template/shared';
import { VirtualMachine } from './vm.model';
import { IpAddress } from '../../shared/models/ip-address.model';
import { Utils } from '../../shared/services/utils/utils.service';

export const virtualMachineEntityName = 'VirtualMachine';
export const nicEntityName = 'Nic';

@Injectable()
@BackendResource({
  entity: virtualMachineEntityName,
})
export class VmService extends BaseBackendService<VirtualMachine> {
  constructor(
    private asyncJobService: AsyncJobService,
    private osTypesService: OsTypeService,
    private volumeService: VolumeService,
    protected http: HttpClient,
  ) {
    super(http);
  }

  public getWithDetails(id: string): Observable<VirtualMachine> {
    return this.getListWithDetails().pipe(map(list => list.find(vm => vm.id === id)));
  }

  public getListWithDetails(params?: {}, lite = false): Observable<VirtualMachine[]> {
    if (lite) {
      return this.getList(params);
    }

    return forkJoin(
      this.getList(params),
      this.volumeService.getList(),
      this.osTypesService.getList(),
    ).pipe(
      map(([vmList, volumes, osTypes]) => {
        vmList.forEach((currentVm, index, vms) => {
          let vmWithVolumeAndOsType = currentVm;
          vmWithVolumeAndOsType = this.addVolumes(vmWithVolumeAndOsType, volumes);
          vmWithVolumeAndOsType = this.addOsType(vmWithVolumeAndOsType, osTypes);
          vms[index] = vmWithVolumeAndOsType;
        });
        return vmList;
      }),
    );
  }

  public deploy(params: {}): Observable<any> {
    return this.sendPostCommand(CSCommands.Deploy, params);
  }

  public command(vm: VirtualMachine, command: string, params?: {}): Observable<VirtualMachine> {
    return this.commandInternal(vm, command, params).pipe(
      switchMap(job => this.registerVmJob(job)),
      tap(jogResult => jogResult),
      catchError(error => {
        return throwError(error);
      }),
    );
  }

  public commandSync(vm: VirtualMachine, command: string, params?: {}): Observable<any> {
    return this.commandInternal(vm, command, params).pipe(
      tap(res => res),
      catchError(error => {
        return throwError(error);
      }),
    );
  }

  public registerVmJob(job: any): Observable<any> {
    return this.asyncJobService.queryJob(job, this.entity);
  }

  public getListOfVmsThatUseIso(iso: Iso): Observable<VirtualMachine[]> {
    return this.getListWithDetails().pipe(map(vmList => vmList.filter(vm => vm.isoid === iso.id)));
  }

  public addIpToNic(nicId: string): Observable<IpAddress> {
    return this.sendCommand(CSCommands.AddIpTo, { nicId }, nicEntityName).pipe(
      switchMap(job => this.asyncJobService.queryJob(job.jobid, nicEntityName)),
    );
  }

  public removeIpFromNic(ipId: string): Observable<any> {
    return this.sendCommand(CSCommands.RemoveIpFrom, { id: ipId }, nicEntityName).pipe(
      switchMap(job => this.asyncJobService.queryJob(job.jobid, nicEntityName)),
    );
  }

  public changeServiceOffering(
    serviceOffering: ServiceOffering,
    virtualMachine: VirtualMachine,
  ): Observable<VirtualMachine> {
    const params = {};

    params['id'] = virtualMachine.id;
    params['serviceOfferingId'] = serviceOffering.id;

    if (serviceOffering.iscustomized) {
      params['details'] = [
        {
          cpuNumber: serviceOffering.cpunumber,
          cpuSpeed: serviceOffering.cpuspeed,
          memory: serviceOffering.memory,
        },
      ];
    }

    return this.sendCommand(CSCommands.ChangeServiceFor, params).pipe(
      map(result => result.virtualmachine),
    );
  }

  public updateSecurityGroup(
    virtualMachine: VirtualMachine,
    securitygroupids: string,
  ): Observable<VirtualMachine> {
    return this.sendCommand(CSCommands.Update, {
      securitygroupids,
      id: virtualMachine.id,
    }).pipe(map(result => result.virtualmachine));
  }

  public updateGroup(virtualMachine: VirtualMachine, group: string): Observable<VirtualMachine> {
    return this.sendCommand(CSCommands.Update, {
      group,
      id: virtualMachine.id,
    }).pipe(map(result => result.virtualmachine));
  }

  public removeGroup(virtualMachine: VirtualMachine): Observable<VirtualMachine> {
    return this.updateGroup(virtualMachine, '');
  }

  public getUserData(id: string): Observable<{ id: string; userdata: string }> {
    return this.sendCommand(CSCommands.GetVMUserData, { virtualmachineid: id }).pipe(
      map(result => {
        // because of cs does not allow to clear userdata, and converts null to 'null' string,
        // assume that 'null' string is empty userdata
        const userdata =
          result.virtualmachineuserdata.userdata === 'null'
            ? null
            : Utils.decodeStringFromBase64(result.virtualmachineuserdata.userdata);
        return { id, userdata };
      }),
    );
  }

  public updateUserData(
    virtualMachine: VirtualMachine,
    userdata: string,
  ): Observable<VirtualMachine> {
    return this.sendPostCommand(CSCommands.Update, {
      id: virtualMachine.id,
      userdata: Utils.encodeStringToBase64(userdata),
    }).pipe(
      map(result => ({
        ...result.virtualmachine,
        userdata,
      })),
    );
  }

  private commandInternal(vm: VirtualMachine, command: string, params?: {}): Observable<any> {
    const commandName = command;
    return this.sendCommand(commandName, this.buildCommandParams(vm.id, commandName, params));
  }

  private buildCommandParams(id: string, commandName: string, params?: {}): any {
    const requestParams = params ? { ...params } : {};

    if (commandName === 'restore') {
      requestParams['virtualMachineId'] = id;
    } else if (commandName !== 'deploy') {
      requestParams['id'] = id;
    }

    return requestParams;
  }

  private addVolumes(vm: VirtualMachine, volumes: Volume[]): VirtualMachine {
    const filteredVolumes = volumes.filter((volume: Volume) => volume.virtualmachineid === vm.id);
    vm.volumes = this.sortVolumes(filteredVolumes);
    return vm;
  }

  private sortVolumes(volumes: Volume[]): Volume[] {
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

  private addOsType(vm: VirtualMachine, osTypes: OsType[]): VirtualMachine {
    vm.osType = osTypes.find((osType: OsType) => osType.id === vm.guestosid);
    return vm;
  }
}
