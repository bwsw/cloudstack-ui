import { Component, OnInit } from '@angular/core';

import { VmService } from './vm.service';
import { TranslateService } from 'ng2-translate';
import { ZoneService } from '../shared/services/zone.service';
import { Zone } from '../shared/models/zone.model';
import { ServiceOfferingService } from '../shared/services/service-offering.service';
import { ServiceOffering } from '../shared/models/service-offering.model';
import { RootDiskSizeService } from '../shared/services/root-disk-size.service';
import { AffinityGroupService } from '../shared/services/affinity-group.service';
import { AffinityGroup } from '../shared/models/affinity-group.model';

const keyboards = ['us', 'uk', 'jp', 'sc'];

@Component({
  selector: 'cs-vm-create',
  templateUrl: './vm-create.component.html',
  styleUrls: ['./vm-create.component.scss']
})
export class VmCreateComponent {

  public rootDiskSize: number;
  public zones: Array<Zone>;
  public zone: number;
  public serviceOfferings: Array<ServiceOffering>;
  public serviceOffering: number;
  public rootDiskSizeLimit: number;
  public keyboard: string;
  public affinityGroups: Array<AffinityGroup>;
  public affinityGroup: number;


  public keyboards = ['us', 'uk', 'jp', 'sc'];

  constructor (
    private vmService: VmService,
    private translateService: TranslateService,
    private zoneService: ZoneService,
    private serviceOfferingService: ServiceOfferingService,
    private rootDiskSizeService: RootDiskSizeService,
    private affinityGroupService: AffinityGroupService
  ) {
    this.rootDiskSize = 0;
    this.affinityGroup = -1;
    this.keyboard = 'us';
    this.zoneService.getList().then(result => {
      if (result) {
        this.zones = result;
        this.zone = result[0].id;
      } else {
        this.zones = [];
      }
    });
    this.serviceOfferingService.getList().then(result => {
      if (result) {
        this.serviceOfferings = result;
        this.serviceOffering = result[0].id;
      } else {
        this.serviceOfferings = [];
      }
    });
    this.rootDiskSizeService.getAvailableRootDiskSize().then(result => {
      this.rootDiskSizeLimit = result;
    });
    this.affinityGroupService.getList().then(result => {
      if (result) {
        this.affinityGroups = result;
      } else {
        this.affinityGroups = [];
      }
    });
  }
}
