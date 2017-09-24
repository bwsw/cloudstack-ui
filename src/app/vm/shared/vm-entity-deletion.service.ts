import { Injectable } from '@angular/core';
import { VirtualMachine } from './vm.model';
import { VolumeType } from '../../shared/models/volume.model';
import { SecurityGroupService } from '../../security-group/services/security-group.service';
import { VolumeService } from '../../shared/services/volume.service';
import { VmService } from './vm.service';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class VmEntityDeletionService {
  constructor(
    public securityGroupService: SecurityGroupService,
    public vmService: VmService,
    public volumeService: VolumeService
  ) {}

  public markVolumesForDeletion(vm: VirtualMachine): Observable<any[]> {
    return this.volumeService.getList({ virtualMachineId: vm.id })
      .switchMap(volumes => {
        const observers = volumes
          .filter(volume => volume.type === VolumeType.DATADISK)
          .map(volume => this.volumeService.markForRemoval(volume));
        return Observable.forkJoin(...observers);
      });
  }

  public markSecurityGroupsForDeletion(vm: VirtualMachine): Observable<any[]> {
    const osb = vm.securityGroup.map(
      sg => this.securityGroupService.markForRemoval(sg));
    return Observable.forkJoin(...osb);
  }
}
