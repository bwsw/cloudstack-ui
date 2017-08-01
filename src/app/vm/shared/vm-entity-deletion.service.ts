import { Injectable } from '@angular/core';
import { VirtualMachine, VmStates } from './vm.model';
import { Volume, VolumeTypes } from '../../shared/models/volume.model';
import { SecurityGroupService } from '../../shared/services/security-group.service';
import { VolumeService } from '../../shared/services/volume.service';
import { SecurityGroup } from '../../security-group/sg.model';


@Injectable()
export class VmEntityDeletionService {
  constructor(
    public securityGroupService: SecurityGroupService,
    public volumeService: VolumeService
  ) {}

  public markVmEntitiesForDeletion(vm: VirtualMachine): void {
    if (vm.state === VmStates.Destroyed) {
      this.markVolumesForDeletion(vm.volumes);
      this.markSecurityGroupsForDeletion(vm.securityGroup);
    }
  }

  private markVolumesForDeletion(volumes: Array<Volume>): void {
    volumes
      .filter(volume => volume.type === VolumeTypes.DATADISK)
      .forEach(volume =>
        this.volumeService.markForDeletion(volume.id).subscribe()
      );
  }

  private markSecurityGroupsForDeletion(securityGroups: Array<SecurityGroup>): void {
    securityGroups.forEach(sg =>
      this.securityGroupService.markForDeletion(sg.id).subscribe()
    );
  }
}
