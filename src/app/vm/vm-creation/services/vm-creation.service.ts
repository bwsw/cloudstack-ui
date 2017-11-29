import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import {
  ICustomOfferingRestrictionsByZone
} from '../../../service-offering/custom-service-offering/custom-offering-restrictions';
import {
  CustomServiceOfferingService,
  DefaultServiceOfferingConfigurationByZone
} from '../../../service-offering/custom-service-offering/service/custom-service-offering.service';
import { SSHKeyPair } from '../../../shared/models/ssh-keypair.model';
import { AffinityGroupService } from '../../../shared/services/affinity-group.service';
import { AuthService } from '../../../shared/services/auth.service';
import { ConfigService } from '../../../shared/services/config.service';
import { DiskOfferingService } from '../../../shared/services/disk-offering.service';
import { OfferingAvailability } from '../../../shared/services/offering.service';
import { ResourceUsageService } from '../../../shared/services/resource-usage.service';
import { SecurityGroupService } from '../../../security-group/services/security-group.service';
import { ServiceOfferingService } from '../../../shared/services/service-offering.service';
import { SSHKeyPairService } from '../../../shared/services/ssh-keypair.service';
import { ZoneService } from '../../../shared/services/zone.service';
import { TemplateFilters } from '../../../template/shared/base-template.service';
import { Iso } from '../../../template/shared/iso.model';
import { IsoService } from '../../../template/shared/iso.service';
import { Template } from '../../../template/shared/template.model';
import { TemplateService } from '../../../template/shared/template.service';
import { VmService } from '../../shared/vm.service';
import { VmCreationData } from '../data/vm-creation-data';

const vmCreationConfigurationKeys = [
  'defaultServiceOfferingConfig',
  'offeringAvailability',
  'customOfferingRestrictions'
];

export interface VmCreationConfigurationData {
  defaultServiceOfferingConfig: DefaultServiceOfferingConfigurationByZone;
  offeringAvailability: OfferingAvailability;
  customOfferingRestrictions: ICustomOfferingRestrictionsByZone;
}

export interface NotSelected {
  name: string;
  ignore: true;
}

@Injectable()
export class VmCreationService {
  constructor(
    private affinityGroupService: AffinityGroupService,
    private authService: AuthService,
    private configService: ConfigService,
    private customServiceOfferingService: CustomServiceOfferingService,
    private diskOfferingService: DiskOfferingService,
    private isoService: IsoService,
    private resourceUsageService: ResourceUsageService,
    private securityGroupService: SecurityGroupService,
    private sshService: SSHKeyPairService,
    private serviceOfferingService: ServiceOfferingService,
    private templateService: TemplateService,
    private translateService: TranslateService,
    private vmService: VmService,
    private zoneService: ZoneService
  ) {}

  public getData(): Observable<VmCreationData> {
    const translationKeys = ['VM_PAGE.VM_CREATION.NO_SSH_KEY'];

    return Observable.forkJoin(
      this.affinityGroupService.getList(),
      this.getDefaultVmName(),
      this.diskOfferingService.getList(),
      this.vmService.getInstanceGroupList(),
      this.resourceUsageService.getResourceUsage(),
      this.serviceOfferingService.getList(),
      this.sshService.getList(),
      this.translateService.get(translationKeys),
      this.getTemplates(),
      this.getIsos(),
      this.zoneService.getList()
    ).map(
      (
        [
          affinityGroupList,
          defaultName,
          diskOfferings,
          instanceGroups,
          resourceUsage,
          serviceOfferings,
          sshKeyPairs,
          translations,
          templates,
          isos,
          zones
        ]
      ) => {
        const configurationData = this.configService.get(
          vmCreationConfigurationKeys
        );
        const securityGroupTemplates = this.securityGroupService.getPredefinedTemplates();
        const sshKeysWithNoKeyOption = this.getSSHKeysWithNoKeyOption(
          sshKeyPairs,
          translations['VM_PAGE.VM_CREATION.NO_SSH_KEY']
        );

        const customServiceOfferingRestrictionsByZone =
          this.customServiceOfferingService.getCustomOfferingRestrictionsByZoneSync(
            configurationData.customOfferingRestrictions,
            resourceUsage
          );

        const rootDiskSizeLimit = Math.min(
          resourceUsage.available.primaryStorage,
          this.authService.getCustomDiskOfferingMaxSize()
        );

        const rootDiskMinSize = this.authService.getCustomDiskOfferingMinSize();

        return new VmCreationData(
          affinityGroupList,
          configurationData,
          customServiceOfferingRestrictionsByZone,
          resourceUsage.available.primaryStorage,
          defaultName,
          diskOfferings,
          instanceGroups,
          resourceUsage,
          rootDiskSizeLimit,
          securityGroupTemplates,
          serviceOfferings,
          sshKeysWithNoKeyOption,
          templates,
          isos,
          zones,
          rootDiskMinSize
        );
      }
    );
  }

  private getSSHKeysWithNoKeyOption(
    sshKeyPairs: Array<SSHKeyPair>,
    noSSHKeyText: string
  ): Array<SSHKeyPair & NotSelected> {
    const sshKeyNotSelected = {
      name: noSSHKeyText,
      ignore: true
    };
    return [].concat([sshKeyNotSelected], sshKeyPairs);
  }

  // TODO fix return type
  private getTemplates(): Observable<Array<Template>> {
    const filters = [TemplateFilters.featured, TemplateFilters.selfExecutable];

    return this.templateService
      .getGroupedTemplates({}, filters, false)
      .map(templates => templates.toArray() as Array<Template>);
  }

  // TODO fix return type
  private getIsos(): Observable<Array<Iso>> {
    const filters = [TemplateFilters.featured, TemplateFilters.selfExecutable];

    return this.isoService
      .getGroupedTemplates({}, filters, false)
      .map(isos => isos.toArray() as Array<Iso>);
  }

  private getDefaultVmName(): Observable<string> {
    return this.vmService.getNumberOfVms().map(numberOfVms => {
      return `vm-${this.authService.user.username}-${numberOfVms + 1}`;
    });
  }
}
