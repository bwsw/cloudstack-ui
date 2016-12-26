import { Component, OnInit } from '@angular/core';

import { BACKEND_API_URL, BaseBackendService } from '../shared/services/base-backend.service';
import { VmService } from './vm.service';
import { TranslateService } from 'ng2-translate';
import { ZoneService } from '../shared/services/zone.service';
import { Zone } from '../shared/models/zone.model';
import { SSHKeyPair } from '../shared/models/SSHKeyPair.model';
import { ServiceOfferingService } from '../shared/services/service-offering.service';
import { ServiceOffering } from '../shared/models/service-offering.model';
import { RootDiskSizeService } from '../shared/services/root-disk-size.service';
import { AffinityGroupService } from '../shared/services/affinity-group.service';
import { AffinityGroup } from '../shared/models/affinity-group.model';
import { SSHKeyPairService } from '../shared/services/SSHKeyPair.service';
import { MdlDialogService } from "angular2-mdl";
import { BaseModel } from "../shared/models/base.model";

class VmCreateStub extends BaseModel { }

@Component({
  selector: 'cs-vm-create',
  templateUrl: './vm-create.component.html',
  styleUrls: ['./vm-create.component.scss']
})
export class VmCreateComponent extends BaseBackendService<VmCreateStub> {

  public name: string;
  public description: string;
  public rootDiskSize: number;
  public zones: Array<Zone>;
  public zone: number;
  public serviceOfferings: Array<ServiceOffering>;
  public serviceOffering: number;
  public rootDiskSizeLimit: number;
  public keyboard: string;
  public affinityGroups: Array<AffinityGroup>;
  public affinityGroup: number;
  public sshKeyPairs: Array<SSHKeyPair>;
  public ssh: string;
  public doStartVm: boolean;

  public keyboards = ['us', 'uk', 'jp', 'sc'];

  constructor (
    private vmService: VmService,
    private translateService: TranslateService,
    private zoneService: ZoneService,
    private serviceOfferingService: ServiceOfferingService,
    private rootDiskSizeService: RootDiskSizeService,
    private affinityGroupService: AffinityGroupService,
    private sshService: SSHKeyPairService,
    private dialogService: MdlDialogService
  ) {
    super();
    this.doStartVm = true;
    this.rootDiskSize = 0;
    this.ssh = '';
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
      this.affinityGroups = result ? result : [];
    });
    this.sshService.getList().then(result => {
      console.log(result);
      if (result) {
        this.sshKeyPairs = result;
        this.ssh = result[0].name;
      } else {
        this.sshKeyPairs = [];
      }
    });
  }

  public deployVm() {
    this.dialogService.confirm('Would you like a mug of coffee?', 'No', 'Yes')
      .toPromise()
      .then(result => {
        let params = {
          'serviceofferingid': this.serviceOffering,
          'templateid': '166e45c1-5ca7-45a0-9111-73e39953f05f',
          'zoneid': this.zone,
        };

        if (this.name) params['name'] = this.name;
        if (this.description) params['description'] = this.description;
        if (this.affinityGroup === -1) params['affinitygroupid'] = this.affinityGroup;
        if (this.rootDiskSize) params['rootdisksize'] = this.rootDiskSize;
        if (!this.doStartVm) params['startvm'] = 'false';
        params['securitygroupids'] = 'c5ffdfe0-7de4-4373-bd55-128e434c81d1';
        params['keyboard'] = this.keyboard;
        params['keypair'] = this.ssh;

        this.http.get(BACKEND_API_URL, { search: this.buildParams('deployVirtualMachine', params) })
          .toPromise()
          .then(result => {
            console.log(result);
          });
      });
  }
}


// return this.http.get(BACKEND_API_URL, { search: this.buildParams(command, params) })
//   .toPromise()
//   .then((res: Response) => {
//     const responseString = `${command}${entity}sresponse`;
//     if (entity === 'asyncjob') {
//       entity += 's';
//     }
//     return res.json()[responseString][`${entity}`];
//   })
//   .catch(error => {
//     this.error.next(error);
//     return Promise.reject(error);
//   });

