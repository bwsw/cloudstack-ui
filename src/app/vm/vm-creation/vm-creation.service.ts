import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AffinityGroupService, AuthService, DiskOfferingService, DiskStorageService } from '../../shared/services';
import { SecurityGroupService } from '../../shared/services/security-group.service';
import { ServiceOfferingFilterService } from '../../shared/services/service-offering-filter.service';
import { SSHKeyPairService } from '../../shared/services/ssh-keypair.service';
import { ZoneService } from '../../shared/services/zone.service';
import { Template, TemplateService } from '../../template/shared';
import { VmService } from '../shared/vm.service';
import { VmCreationData } from './vm-creation-data/vm-creation-data';
import {
  AffinityGroup, AffinityGroupType, DiskOffering, InstanceGroup, ServiceOffering,
  SSHKeyPair, Zone
} from '../../shared/models';
import { SecurityGroup } from '../../security-group/sg.model';


@Injectable()
export class VmCreationService {
  constructor(
    private affinityGroupService: AffinityGroupService,
    private authService: AuthService,
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
      defaultName:              this.getDefaultVmName(),
      // todo: temporary hardcoded zone for debugging
      defaultTemplate:          this.templateService.getDefault('031a55bb-5d6b-4336-ab93-d5dead28a887'),
      diskOfferings:            this.diskOfferingService.getList(),
      instanceGroups:           this.vmService.getInstanceGroupList(),
      rootDiskSizeLimit:        this.diskStorageService.getAvailablePrimaryStorage(),
      securityGroupTemplates:   this.securityGroupService.getTemplates(),
      serviceOfferings:         this.serviceOfferingFilterService.getAvailable(),
      sshKeyPairs:              this.sshService.getList(),
      zones:                    this.zoneService.getList()
    };
    const requests = Object.values(data);

    return Observable
      .forkJoin(requests)
      .map(([
        affinityGroupList,
        affinityGroupTypes,
        availablePrimaryStorage,
        defaultName,
        defaultTemplate,
        diskOfferings,
        instanceGroups,
        rootDiskSizeLimit,
        securityGroupTemplates,
        serviceOfferings,
        sshKeyPairs,
        zones
      ]: [
        Array<AffinityGroup>,
        Array<AffinityGroupType>,
        number,
        string,
        Template,
        Array<DiskOffering>,
        Array<InstanceGroup>,
        number,
        Array<SecurityGroup>,
        Array<ServiceOffering>,
        Array<SSHKeyPair>,
        Array<Zone>
      ]) => new VmCreationData(
        affinityGroupList,
        affinityGroupTypes,
        availablePrimaryStorage,
        defaultName,
        defaultTemplate,
        diskOfferings,
        instanceGroups,
        rootDiskSizeLimit,
        securityGroupTemplates,
        serviceOfferings,
        sshKeyPairs,
        zones
      ));
  }

  private getDefaultVmName(): Observable<string> {
    return this.vmService.getNumberOfVms()
      .map(numberOfVms => {
        return `vm-${this.authService.username}-${numberOfVms + 1}`;
      });
  }
}
