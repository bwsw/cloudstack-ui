import { Component, ViewChild, Output, EventEmitter } from '@angular/core';
import { ZoneService } from '../shared/services/zone.service';
import { Zone } from '../shared/models/zone.model';
import { SSHKeyPair } from '../shared/models/SSHKeyPair.model';
import { ServiceOfferingService } from '../shared/services/service-offering.service';
import { ServiceOffering } from '../shared/models/service-offering.model';
import { RootDiskSizeService } from '../shared/services/root-disk-size.service';
import { AffinityGroupService } from '../shared/services/affinity-group.service';
import { AffinityGroup } from '../shared/models/affinity-group.model';
import { SSHKeyPairService } from '../shared/services/SSHKeyPair.service';
import { MdlDialogComponent } from 'angular2-mdl';
import { VmService } from "./vm.service";
import { TranslateService } from "ng2-translate";

import {
  JobsNotificationService,
  INotificationStatus
} from '../shared/services/jobs-notification.service';


@Component({
  selector: 'cs-vm-create',
  templateUrl: './vm-create.component.html',
  styleUrls: ['./vm-create.component.scss']
})
export class VmCreateComponent {

  @ViewChild(MdlDialogComponent) public vmCreateDialog: MdlDialogComponent;
  @Output() onCreated: EventEmitter<any> = new EventEmitter();

  public name: string;
  public description: string;
  public rootDiskSize: number;
  public zones: Array<Zone>;
  public zoneId: string;
  public serviceOfferings: Array<ServiceOffering>;
  public serviceOfferingId: string;
  public rootDiskSizeLimit: number;
  public keyboard: string;
  public affinityGroups: Array<AffinityGroup>;
  public affinityGroupId: number;
  public sshKeyPairs: Array<SSHKeyPair>;
  public sshId: string;
  public doStartVm: boolean;

  public keyboards = ['us', 'uk', 'jp', 'sc'];

  constructor(
    private zoneService: ZoneService,
    private serviceOfferingService: ServiceOfferingService,
    private rootDiskSizeService: RootDiskSizeService,
    private affinityGroupService: AffinityGroupService,
    private sshService: SSHKeyPairService,
    private vmService: VmService,
    private jobsNotificationService: JobsNotificationService,
    private translateService: TranslateService
  ) {
    this.updateVmCreateData();
  }

  public show(): void {
    this.updateVmCreateData();
    this.vmCreateDialog.show();
  }

  public hide(): void {
    this.vmCreateDialog.close();
  }

  public updateVmCreateData(): void {
    this.doStartVm = true;
    this.rootDiskSize = 9;
    this.sshId = '';
    this.affinityGroupId = -1; // not selected
    this.keyboard = 'us';
    this.zoneService.getList().then(result => {
      this.zones = result;
      if (result.length) {
        this.zoneId = result[0].id;
      }
    });
    this.serviceOfferingService.getList().then(result => {
      this.serviceOfferings = result;
      if (result.length) {
        this.serviceOfferingId = result[0].id;
      }
    });
    this.rootDiskSizeService.getAvailableRootDiskSize().then(result => {
      this.rootDiskSizeLimit = result;
    });
    this.affinityGroupService.getList().then(result => {
      this.affinityGroups = result;
    });
    this.sshService.getList().then(result => {
      this.sshKeyPairs = result;
      if (result.length) {
        this.sshId = result[0].name;
      }
    });
  }

  public deployVm(): void {
    let params = {
      'serviceofferingid': this.serviceOfferingId,
      'templateid': '166e45c1-5ca7-45a0-9111-73e39953f05f', // temp
      'zoneid': this.zoneId,
      'response': 'json'
    };

    if (this.name) { params['name'] = this.name; }
    if (this.description) { params['description'] = this.description; }
    if (this.affinityGroupId !== -1) { params['affinitygroupid'] = this.affinityGroupId; }
    if (this.rootDiskSize >= 10) { params['rootdisksize'] = this.rootDiskSize; } // 10GB is temporary. need to employ
                                                                                 // the resource service to get min size
                                                                                 // or something
    if (!this.doStartVm) { params['startvm'] = 'false'; }
    params['securitygroupids'] = 'c5ffdfe0-7de4-4373-bd55-128e434c81d1'; // temp
    params['keyboard'] = this.keyboard;
    params['keypair'] = this.sshId;

    this.translateService.get([
      'VM_DEPLOY_IN_PROGRESS',
      'DEPLOY_DONE',
      'DEPLOY_IN_PROGRESS'
    ]).subscribe(strs => {
      let id = this.jobsNotificationService.add(strs.VM_DEPLOY_IN_PROGRESS);

      this.vmService.deploy(params)
        .subscribe(result => {
          this.vmService.get(result.id)
            .then(r => {
              r.state = 'Deploying';
              this.onCreated.next(r);
            });
          this.vmService.checkDeploy(result.jobid)
            .subscribe(() => {
              this.jobsNotificationService.add({
                id,
                message: strs.DEPLOY_DONE,
                status: INotificationStatus.Finished
              });
            });
        });
    });
  }
}
