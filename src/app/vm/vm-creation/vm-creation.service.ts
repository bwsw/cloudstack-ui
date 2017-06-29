import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AffinityGroupService, AuthService, DiskOfferingService, DiskStorageService } from '../../shared/services';
import { ResourceUsageService } from '../../shared/services/resource-usage.service';
import { SecurityGroupService } from '../../shared/services/security-group.service';
import { ServiceOfferingFilterService } from '../../shared/services/service-offering-filter.service';
import { SSHKeyPairService } from '../../shared/services/ssh-keypair.service';
import { ZoneService } from '../../shared/services/zone.service';
import { TemplateService } from '../../template/shared';
import { VmService } from '../shared/vm.service';
import { VmCreationData } from './data/vm-creation-data';


@Injectable()
export class VmCreationService {
  constructor(
    private affinityGroupService: AffinityGroupService,
    private authService: AuthService,
    private diskOfferingService: DiskOfferingService,
    private diskStorageService: DiskStorageService,
    private resourceUsageService: ResourceUsageService,
    private securityGroupService: SecurityGroupService,
    private sshService: SSHKeyPairService,
    private serviceOfferingFilterService: ServiceOfferingFilterService,
    private templateService: TemplateService,
    private vmService: VmService,
    private zoneService: ZoneService
  ) {}

  public getData(): Observable<VmCreationData> {
    return Observable
      .forkJoin(
        this.affinityGroupService.getList(),
        this.affinityGroupService.getTypes(),

        this.diskStorageService.getAvailablePrimaryStorage(),
        this.getDefaultVmName(),
        // todo: temporary hardcoded zone for debugging
        this.templateService.getDefault('031a55bb-5d6b-4336-ab93-d5dead28a887'),
        this.diskOfferingService.getList(),
        this.vmService.getInstanceGroupList(),
        this.resourceUsageService.getResourceUsage(),
        this.diskStorageService.getAvailablePrimaryStorage(),
        this.securityGroupService.getTemplates(),
        this.serviceOfferingFilterService.getAvailable(),
        this.sshService.getList(),
        this.zoneService.getList()
      )
      .map((
        [
          affinityGroupList,
          affinityGroupTypes,
          availablePrimaryStorage,
          defaultName,
          defaultTemplate,
          diskOfferings,
          instanceGroups,
          resourceUsage,
          rootDiskSizeLimit,
          securityGroupTemplates,
          serviceOfferings,
          sshKeyPairs,
          zones
        ]) => {
        return new VmCreationData(
          affinityGroupList,
          affinityGroupTypes,
          availablePrimaryStorage,
          defaultName,
          defaultTemplate,
          diskOfferings,
          instanceGroups,
          resourceUsage,
          rootDiskSizeLimit,
          securityGroupTemplates,
          serviceOfferings,
          sshKeyPairs,
          zones
        );
      });
  }

  private getDefaultVmName(): Observable<string> {
    return this.vmService.getNumberOfVms()
      .map(numberOfVms => {
        return `vm-${this.authService.username}-${numberOfVms + 1}`;
      });
  }
}
