import { Injectable } from '@angular/core';
import { VirtualMachine, VmStates } from './vm.model';
import { Volume, VolumeTypes } from '../../shared/models/volume.model';
import { SecurityGroupService } from '../../shared/services/security-group.service';
import { VolumeService } from '../../shared/services/volume.service';
import { SecurityGroup } from '../../security-group/sg.model';
import { VmService } from './vm.service';
import { VirtualAction } from 'rxjs/scheduler/VirtualTimeScheduler';


@Injectable()
export class VmEntityDeletionService {
  constructor(
    public securityGroupService: SecurityGroupService,
    public vmService: VmService,
    public volumeService: VolumeService
  ) {}

  public markVolumesForDeletion(vm: VirtualMachine): void {
    this.volumeService.getList({ virtualMachineId: vm.id })
      .subscribe(volumes => {
        volumes
          .filter(volume => volume.type === VolumeTypes.DATADISK)
          .forEach(volume =>
            this.volumeService.markForDeletion(volume.id).subscribe()
          );
      })
  }

  public markSecurityGroupsForDeletion(vm: VirtualMachine): void {
    vm.securityGroup.forEach(sg =>
      this.securityGroupService.markForDeletion(sg.id).subscribe()
    );
  }
}
