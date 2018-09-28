import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { VirtualMachine } from './vm.model';
import { VolumeType } from '../../shared/models/volume.model';
import { SecurityGroupService } from '../../security-group/services/security-group.service';
import { VolumeService } from '../../shared/services/volume.service';

@Injectable()
export class VmEntityDeletionService {
  constructor(
    public securityGroupService: SecurityGroupService,
    public volumeService: VolumeService
  ) {}

  public markVolumesForDeletion(vm: VirtualMachine): Observable<any[]> {
    return this.volumeService.getList({ virtualMachineId: vm.id }).pipe(
      switchMap(volumes => {
        const observers = volumes
          .filter(volume => volume.type === VolumeType.DATADISK)
          .map(volume => this.volumeService.markForRemoval(volume));
        return forkJoin(...observers);
      })
    );
  }

  public markSecurityGroupsForDeletion(vm: VirtualMachine): Observable<any[]> {
    const osb = vm.securityGroup.map(sg => this.securityGroupService.markForRemoval(sg));
    return forkJoin(...osb);
  }
}
