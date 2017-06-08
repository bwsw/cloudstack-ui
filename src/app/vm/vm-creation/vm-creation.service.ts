import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AffinityGroupService, DiskOfferingService, DiskStorageService } from '../../shared/services';
import { SecurityGroupService } from '../../shared/services/security-group.service';
import { ServiceOfferingFilterService } from '../../shared/services/service-offering-filter.service';
import { SSHKeyPairService } from '../../shared/services/ssh-keypair.service';
import { TemplateService } from '../../template/shared';
import { VmService } from '../shared/vm.service';
import { ZoneService } from '../../shared/services/zone.service';
import { VmCreationData } from './vm-creation-data/vm-creation-data';


@Injectable()
export class VmCreationService {
  constructor(
    private affinityGroupService: AffinityGroupService,
    private diskOfferingService: DiskOfferingService,
    private diskStorageService: DiskStorageService,
    private securityGroupService: SecurityGroupService,
    private sshService: SSHKeyPairService,
    private serviceOfferingFilterService: ServiceOfferingFilterService,
    private templateService: TemplateService,
    private vmService: VmService,
    private zoneService: ZoneService
  ) {}

  public getData(): Observable<VmCreationData> {
    const data = {
      affinityGroupList:        this.affinityGroupService.getList(),
      affinityGroupTypes:       this.affinityGroupService.getTypes(),
      availablePrimaryStorage:  this.diskStorageService.getAvailablePrimaryStorage(),
      // todo: temporary hardcoded zone for debugging
      defaultTemplate:          this.templateService.getDefault('031a55bb-5d6b-4336-ab93-d5dead28a887'),
      diskOfferings:            this.diskOfferingService.getList(),
      instanceGroups:           this.vmService.getInstanceGroupList(),
      securityGroupTemplates:   this.securityGroupService.getTemplates(),
      serviceOfferings:         this.serviceOfferingFilterService.getAvailable(),
      sshKeyPairs:              this.sshService.getList(),
      zones:                    this.zoneService.getList()
    };
    const requests = Object.values(data);

    return Observable
      .forkJoin(requests)
      .map(result => new VmCreationData(...result));
  }
}
