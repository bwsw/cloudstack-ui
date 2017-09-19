import { Injectable } from '@angular/core';
import { VirtualMachine } from './vm.model';
import { VolumeType } from '../../shared/models/volume.model';
import { SecurityGroupService } from '../../security-group/services/security-group.service';
import { VolumeService } from '../../shared/services/volume.service';
import { VmService } from './vm.service';
import { Observable } from "rxjs/Observable";


@Injectable()
export class VmEntityDeletionService {
  constructor(
    public securityGroupService: SecurityGroupService,
    public vmService: VmService,
    public volumeService: VolumeService
  ) {}

  public markVolumesForDeletion(vm: VirtualMachine): void {
    this.volumeService.getList({ virtualMachineId: vm.id })
      .switchMap(volumes => {
        const observers = volumes
          .filter(volume => volume.type === VolumeType.DATADISK)
          .map(volume =>
            this.volumeService.markForRemoval(volume));
        return Observable.forkJoin(...observers);
      }).subscribe();
  }

  public markSecurityGroupsForDeletion(vm: VirtualMachine): void {
    vm.securityGroup.forEach(sg =>
      this.securityGroupService.markForRemoval(sg).subscribe()
    );
  }
}
