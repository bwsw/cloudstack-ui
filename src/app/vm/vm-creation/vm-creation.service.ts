import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import {
  CustomOfferingRestrictions
} from '../../service-offering/custom-service-offering/custom-offering-restrictions';
import {
  AffinityGroupService,
  AuthService,
  ConfigService,
  DiskOfferingService,
  DiskStorageService,
  ServiceOfferingService
} from '../../shared/services';
import { OfferingAvailability } from '../../shared/services/offering.service';
import { ResourceUsageService } from '../../shared/services/resource-usage.service';
import { SecurityGroupService } from '../../shared/services/security-group.service';
import { SSHKeyPairService } from '../../shared/services/ssh-keypair.service';
import { ZoneService } from '../../shared/services/zone.service';
import { Iso, IsoService, Template, TemplateService } from '../../template/shared';
import { TemplateFilters } from '../../template/shared/base-template.service';
import { VmService } from '../shared/vm.service';
import { VmCreationData } from './data/vm-creation-data';


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
    private serviceOfferingService: ServiceOfferingService,
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
        this.diskOfferingService.getList(),
        this.vmService.getInstanceGroupList(),
        this.resourceUsageService.getResourceUsage(),
        this.diskStorageService.getAvailablePrimaryStorage(),
        this.securityGroupService.getTemplates(),
        this.serviceOfferingService.getList(),
        this.sshService.getList(),
        this.getTemplates(),
        this.getIsos(),
        this.zoneService.getList(),
      )
      .map((
        [
          affinityGroupList,
          configurationData,
          availablePrimaryStorage,
          defaultName,
          diskOfferings,
          instanceGroups,
          resourceUsage,
          rootDiskSizeLimit,
          securityGroupTemplates,
          serviceOfferings,
          sshKeyPairs,
          templates,
          isos,
          zones
        ]) => {
        return new VmCreationData(
          affinityGroupList,
          configurationData,
          availablePrimaryStorage,
          defaultName,
          diskOfferings,
          instanceGroups,
          resourceUsage,
          rootDiskSizeLimit,
          securityGroupTemplates,
          serviceOfferings,
          sshKeyPairs,
          templates,
          isos,
          zones
        );
      });
  }

  private getTemplates(): Observable<Array<Template>> {
    const filters = [
      TemplateFilters.featured,
      TemplateFilters.selfExecutable
    ];

    return this.templateService.getGroupedTemplates({}, filters)
      .map(templates => templates.toArray());
  }

  private getIsos(): Observable<Array<Iso>> {
    const filters = [
      TemplateFilters.featured,
      TemplateFilters.selfExecutable
    ];

    return this.isoService.getGroupedTemplates({}, filters)
      .map(isos => isos.toArray());
  }

  private getDefaultVmName(): Observable<string> {
    return this.vmService.getNumberOfVms()
      .map(numberOfVms => {
        return `vm-${this.authService.username}-${numberOfVms + 1}`;
      });
  }
}
