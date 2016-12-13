import { Injectable } from '@angular/core';

import { BaseBackendService } from '../shared/services';
import { BackendResource } from '../shared/decorators';
import { VirtualMachine } from './vm.model';
import { VolumeService } from '../shared/services/volume.service';
import { Volume } from '../shared/models/volume.model';
import { OsTypeService } from '../shared/services/os-type.service';
import { OsType } from '../shared/models/os-type.model';

@Injectable()
@BackendResource({
  entity: 'VirtualMachine',
  entityModel: VirtualMachine
})
export class VmService extends BaseBackendService<VirtualMachine> {
  constructor(private volumeService: VolumeService, private osTypesService: OsTypeService) {
    super();
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
}
