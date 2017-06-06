import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { SecurityGroup } from '../../security-group/sg.model';
import {
  AffinityGroup,
  AffinityGroupType,
  DiskOffering,
  InstanceGroup,
  ServiceOffering,
  SSHKeyPair, Zone
} from '../../shared/models';
import { AffinityGroupService, DiskOfferingService, DiskStorageService } from '../../shared/services';
import { SecurityGroupService } from '../../shared/services/security-group.service';
import { ServiceOfferingFilterService } from '../../shared/services/service-offering-filter.service';
import { SSHKeyPairService } from '../../shared/services/ssh-keypair.service';
import { Template, TemplateService } from '../../template/shared';
import { VmService } from '../shared/vm.service';
import { ZoneService } from '../../shared/services/zone.service';


export interface VmCreationData {
  affinityGroupList: Array<AffinityGroup>;
  affinityGroupTypes: Array<AffinityGroupType>;
  availablePrimaryStorage: number;
  defaultTemplate: Template;
  diskOfferings: Array<DiskOffering>;
  instanceGroups: Array<InstanceGroup>;
  securityGroupTemplates: Array<SecurityGroup>;
  serviceOfferings: Array<ServiceOffering>;
  sshKeyPairs: Array<SSHKeyPair>;
  zones: Array<Zone>;
}

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
      // temporary hardcoded zone for debugging
      defaultTemplate:          this.templateService.getDefault('031a55bb-5d6b-4336-ab93-d5dead28a887'),
      diskOfferings:            this.diskOfferingService.getList(),
      instanceGroups:           this.vmService.getInstanceGroupList(),
      securityGroupTemplates:   this.securityGroupService.getTemplates(),
      serviceOfferings:         this.serviceOfferingFilterService.getAvailable(),
      sshKeyPairs:              this.sshService.getList(),
      zones:                    this.zoneService.getList()
    };
    const fieldNames = Object.keys(data);
    const requests = Object.values(data);

    return Observable
      .forkJoin(requests)
      .map(result => {
        return result.reduce((acc, requestResult, index) => {
          acc[fieldNames[index]] = requestResult;
          return acc;
        }, {});
      });
  }
}
