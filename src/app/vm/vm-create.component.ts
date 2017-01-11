import { Component, ViewChild, Output, EventEmitter } from '@angular/core';
import { ZoneService } from '../shared/services/zone.service';
import { Zone } from '../shared/models/zone.model';
import { SSHKeyPair } from '../shared/models/SSHKeyPair.model';
import { ServiceOffering } from '../shared/models/service-offering.model';
import { AffinityGroupService } from '../shared/services/affinity-group.service';
import { AffinityGroup } from '../shared/models/affinity-group.model';
import { SSHKeyPairService } from '../shared/services/SSHKeyPair.service';
import { MdlDialogComponent } from 'angular2-mdl';
import { VmService } from './vm.service';
import { VirtualMachine, MIN_ROOT_DISK_SIZE, MAX_ROOT_DISK_SIZE_ADMIN } from './vm.model';
import { TranslateService } from 'ng2-translate';

import {
  JobsNotificationService,
  INotificationStatus
} from '../shared/services/jobs-notification.service';

import { TemplateService } from '../shared/services/template.service';
import { NotificationService } from '../shared/notification.service';
import { DiskStorageService } from '../shared/services/disk-storage.service';
import { ServiceOfferingFilterService } from '../shared/services/service-offering-filter.service';
import { ResourceUsageService } from '../shared/services/resource-usage.service';
import { Template } from '../shared/models/template.model';

class VmCreationData {
  public vm: VirtualMachine;
  public affinityGroups: Array<AffinityGroup>;
  public serviceOfferings: Array<ServiceOffering>;
  public sshKeyPairs: Array<SSHKeyPair>;
  public zones: Array<Zone>;

  public affinityGroupId: string;
  public doStartVm: boolean;
  public keyboard: string;
  public keyPair: string;
  public rootDiskSize: number;
  public rootDiskSizeLimit: number;

  constructor() {
    this.vm = new VirtualMachine({
      keyPair: ''
    });
    this.affinityGroupId = '';
    this.rootDiskSize = MIN_ROOT_DISK_SIZE - 1; // minimum allowed size minus 1 equals auto (min slider value)
    this.rootDiskSizeLimit = 0;
    this.doStartVm = true;
    this.keyboard = 'us';
  }
}

@Component({
  selector: 'cs-vm-create',
  templateUrl: './vm-create.component.html',
  styleUrls: ['./vm-create.component.scss']
})
export class VmCreateComponent {

  @ViewChild(MdlDialogComponent) public vmCreateDialog: MdlDialogComponent;
  @Output() public onCreated: EventEmitter<any> = new EventEmitter();

  public vmCreationData: VmCreationData;
  public keyboards = ['us', 'uk', 'jp', 'sc'];

  constructor(
    private zoneService: ZoneService,
    private serviceOfferingFilterService: ServiceOfferingFilterService,
    private diskStorageService: DiskStorageService,
    private affinityGroupService: AffinityGroupService,
    private sshService: SSHKeyPairService,
    private vmService: VmService,
    private jobsNotificationService: JobsNotificationService,
    private templateService: TemplateService,
    private translateService: TranslateService,
    private notificationService: NotificationService,
    private resourceUsageService: ResourceUsageService,
  ) {
    this.vmCreationData = new VmCreationData();
  }

  public show(): void {
    this.templateService.getDefault().then(() => {
      this.serviceOfferingFilterService.getAvailable().then(() => {
        this.resourceUsageService.getResourceUsage().then(result => {
          if (result.available.primaryStorage > MIN_ROOT_DISK_SIZE && result.available.instances) {
            this.resetVmCreateData();
            this.vmCreateDialog.show();
          } else {
            throw Error();
          }
        });
      }).catch(() => {
        this.translateService.get(['INSUFFICIENT_RESOURCES']).subscribe(strs => {
          this.notificationService.error(strs['INSUFFICIENT_RESOURCES']);
        });
      });
    }).catch(() => {
      this.translateService.get(['UNABLE_TO_RECEIVE_TEMPLATES']).subscribe(strs => {
        this.notificationService.error(strs['UNABLE_TO_RECEIVE_TEMPLATES']);
      });
    });
  }

  public hide(): void {
    this.vmCreateDialog.close();
  }

  public resetVmCreateData(): void {
    this.getVmCreateData().then(result => {
      this.vmCreationData = result;
    });
  }

  public deployVm(): void {
    let params = this.vmCreateParams;
    this.translateService.get([
      'VM_DEPLOY_IN_PROGRESS'
    ]).subscribe(strs => {
      let id = this.jobsNotificationService.add(strs['VM_DEPLOY_IN_PROGRESS']);
      this.vmService.deploy(params)
        .subscribe(result => {
          this.vmService.get(result.id)
            .then(r => {
              r.state = 'Deploying';
              this.onCreated.next(r);
            }).catch(() => {console.log(1)});
          this.vmService.checkDeploy(result.jobid)
            .subscribe(() => this.notifyOnDeployDone(id));
        });
    });
  }

  public notifyOnDeployDone(notificationId: string) {
    this.translateService.get([
      'DEPLOY_DONE'
    ]).subscribe(str => {
      this.jobsNotificationService.add({
        id: notificationId,
        message: str['DEPLOY_DONE'],
        status: INotificationStatus.Finished
      });
    });
  }

  public onVmCreationSubmit(e: any): void {
    this.deployVm();
    this.hide();
  }

  public onTemplateChange(t: Template): void {
    this.vmCreationData.vm.template = t;
  }

  private getVmCreateData(): Promise<VmCreationData> {
    let vmCreationData = new VmCreationData();

    const p = [];
    p.push(this.zoneService.getList());
    p.push(this.serviceOfferingFilterService.getAvailable());
    p.push(this.diskStorageService.getAvailablePrimaryStorage());
    p.push(this.affinityGroupService.getList());
    p.push(this.sshService.getList());
    p.push(this.templateService.getDefault());

    return Promise.all(p).then(result => {
      vmCreationData.zones = result[0];
      vmCreationData.serviceOfferings = result[1];
      vmCreationData.rootDiskSizeLimit = result[2];
      vmCreationData.affinityGroups = result[3];
      vmCreationData.sshKeyPairs = result[4];
      vmCreationData.vm.template = result[5];

      if (result[0].length) {
        vmCreationData.vm.zoneId = result[0][0].id;
      }
      if (result[1].length) {
        vmCreationData.vm.serviceOfferingId = result[1][0].id;
      }
      if (result[2] === -1) {
        vmCreationData.rootDiskSizeLimit = MAX_ROOT_DISK_SIZE_ADMIN;
      }

      if (result[4].length) {
        vmCreationData.vm.keyPair = result[4][0].name;
      }
      return vmCreationData;
    });
  }

  private get vmCreateParams(): {} {
    let params = {
      'serviceofferingid': this.vmCreationData.vm.serviceOfferingId,
      'templateid': this.vmCreationData.vm.template.id,
      'zoneid': this.vmCreationData.vm.zoneId,
      'keypair': this.vmCreationData.keyPair,
      'keyboard': this.vmCreationData.keyboard,
      'response': 'json'
    };

    if (this.vmCreationData.vm.displayName) {
      params['name'] = this.vmCreationData.vm.displayName;
    }
    if (this.vmCreationData.affinityGroupId) {
      params['affinitygroupids'] = this.vmCreationData.affinityGroupId;
    }
    if (this.vmCreationData.rootDiskSize >= 10) {
      params['rootdisksize'] = this.vmCreationData.rootDiskSize;
    }
    if (!this.vmCreationData.doStartVm) {
      params['startvm'] = 'false';
    }
//    params['securitygroupids'] = 'c5ffdfe0-7de4-4373-bd55-128e434c81d1'; // temp
    return params;
  }
}
