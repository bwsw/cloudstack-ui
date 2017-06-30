import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import {
  AffinityGroupService, AuthService, ConfigService, DiskOfferingService,
  DiskStorageService
} from '../../shared/services';
import { ResourceUsageService } from '../../shared/services/resource-usage.service';
import { SecurityGroupService } from '../../shared/services/security-group.service';
import { ServiceOfferingFilterService } from '../../shared/services/service-offering-filter.service';
import { SSHKeyPairService } from '../../shared/services/ssh-keypair.service';
import { ZoneService } from '../../shared/services/zone.service';
import { Iso, IsoService, Template, TemplateService } from '../../template/shared';
import { VmService } from '../shared/vm.service';
import { VmCreationData } from './data/vm-creation-data';
import { OfferingAvailability } from '../../shared/services/offering.service';
import {
  CustomOfferingRestrictions
} from '../../service-offering/custom-service-offering/custom-offering-restrictions';
import { TemplateFilters } from '../../template/shared/base-template.service';


const vmCreationConfigurationKeys = [
  'offeringAvailability',
  'customOfferingRestrictions'
];

export interface VmCreationConfigurationData {
  offeringAvailability: OfferingAvailability;
  customOfferingRestrictions: CustomOfferingRestrictions;
}

@Injectable()
export class VmCreationService {
  constructor(
    private affinityGroupService: AffinityGroupService,
    private authService: AuthService,
    private configService: ConfigService,
    private diskOfferingService: DiskOfferingService,
    private diskStorageService: DiskStorageService,
    private isoService: IsoService,
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
        this.configService.get(vmCreationConfigurationKeys),
        this.diskStorageService.getAvailablePrimaryStorage(),
        this.getDefaultVmName(),
        // todo: temporary hardcoded zone for debugging
        this.templateService.getDefault('031a55bb-5d6b-4336-ab93-d5dead28a887'),
        this.diskOfferingService.getList(),
        this.vmService.getInstanceGroupList(),
        this.resourceUsageService.getResourceUsage(),
        this.diskStorageService.getAvailablePrimaryStorage(),
        this.securityGroupService.getTemplates(),
        this.serviceOfferingFilterService.getAvailableByZoneAndResources(),
        this.sshService.getList(),
        this.zoneService.getList(),
      )
      .map((
        [
          affinityGroupList,
          configurationData,
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
          configurationData,
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

  public getTemplates(): Observable<Array<Template>> {
    const filters = [
      TemplateFilters.featured,
      TemplateFilters.selfExecutable
    ];

    return this.templateService.getGroupedTemplates({}, filters)
      .map(templates => templates.toArray());
  }

  public getIsos(): Observable<Array<Iso>> {
    const params = { bootable: true };
    const filters = [
      TemplateFilters.featured,
      TemplateFilters.selfExecutable
    ];

    return this.isoService.getGroupedTemplates(params, filters)
      .map(isos => isos.toArray());
  }

  private getDefaultVmName(): Observable<string> {
    return this.vmService.getNumberOfVms()
      .map(numberOfVms => {
        return `vm-${this.authService.username}-${numberOfVms + 1}`;
      });
  }
}
