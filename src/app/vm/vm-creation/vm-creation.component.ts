import { Component, ViewChild, Output, EventEmitter } from '@angular/core';
import { TranslateService } from 'ng2-translate';
import * as UUID from 'uuid';

import { ZoneService } from '../../shared/services/zone.service';
import { Zone } from '../../shared/models/zone.model';
import { SSHKeyPair } from '../../shared/models/SSHKeyPair.model';
import { ServiceOffering } from '../../shared/models/service-offering.model';
import { AffinityGroupService } from '../../shared/services/affinity-group.service';
import { AffinityGroup } from '../../shared/models/affinity-group.model';
import { SSHKeyPairService } from '../../shared/services/SSHKeyPair.service';
import { MdlDialogComponent } from 'angular2-mdl';
import { VmService } from '../vm.service';
import { VirtualMachine, MIN_ROOT_DISK_SIZE, MAX_ROOT_DISK_SIZE_ADMIN } from '../vm.model';

import {
  JobsNotificationService,
  INotificationStatus
} from '../../shared/services/jobs-notification.service';

import { TemplateService } from '../../shared/services/template.service';
import { NotificationService } from '../../shared/services/notification.service';
import { DiskStorageService } from '../../shared/services/disk-storage.service';
import { ServiceOfferingFilterService } from '../../shared/services/service-offering-filter.service';
import { ResourceUsageService } from '../../shared/services/resource-usage.service';
import { Template } from '../../shared/models/template.model';
import { Rules } from '../../security-group/sg-creation/sg-creation.component';
import { SecurityGroupService, GROUP_POSTFIX } from '../../shared/services/security-group.service';
import { Observable } from 'rxjs/Rx';


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
  public rootDiskSizeMin: number;
  public rootDiskSizeLimit: number;

  constructor() {
    this.vm = new VirtualMachine({
      keyPair: ''
    });
    this.affinityGroupId = '';
    this.rootDiskSize = MIN_ROOT_DISK_SIZE;
    this.rootDiskSizeMin = MIN_ROOT_DISK_SIZE;
    this.rootDiskSizeLimit = 0;
    this.doStartVm = true;
    this.keyboard = 'us';
  }
}

@Component({
  selector: 'cs-vm-create',
  templateUrl: 'vm-creation.component.html',
  styleUrls: ['vm-creation.component.scss']
})
export class VmCreationComponent {
  @ViewChild(MdlDialogComponent) public vmCreateDialog: MdlDialogComponent;
  @Output() public onCreated: EventEmitter<any> = new EventEmitter();

  public vmCreationData: VmCreationData;
  public keyboards = ['us', 'uk', 'jp', 'sc'];
  public securityRules: Rules;

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
    private securityGroupService: SecurityGroupService
  ) {
    this.vmCreationData = new VmCreationData();
  }

  public show(): void {
    this.templateService.getDefault().subscribe(() => {
      this.serviceOfferingFilterService.getAvailable().subscribe(() => {
        this.resourceUsageService.getResourceUsage().subscribe(result => {
          if (result.available.primaryStorage > this.vmCreationData.rootDiskSizeMin && result.available.instances) {
            this.resetVmCreateData();
            this.vmCreateDialog.show();
          } else {
            this.translateService.get(['INSUFFICIENT_RESOURCES']).subscribe(strs => {
              this.notificationService.error(strs['INSUFFICIENT_RESOURCES']);
            });
          }
        });
      }, () => {
        this.translateService.get(['INSUFFICIENT_RESOURCES']).subscribe(strs => {
          this.notificationService.error(strs['INSUFFICIENT_RESOURCES']);
        });
      });
    }, () => {
      this.translateService.get(['UNABLE_TO_RECEIVE_TEMPLATES']).subscribe(strs => {
        this.notificationService.error(strs['UNABLE_TO_RECEIVE_TEMPLATES']);
      });
    });
  }

  public hide(): void {
    this.securityRules = new Rules();
    this.vmCreateDialog.close();
  }

  public resetVmCreateData(): void {
    this.getVmCreateData().subscribe(result => {
      this.vmCreationData = result;
    });
  }

  public deployVm(): void {
    let params: any = this.vmCreateParams;
    this.securityGroupService.createWithRules(
      { name: UUID.v4() + GROUP_POSTFIX },
      params.ingress || [],
      params.egress || []
    ).subscribe(securityGroup => {
      params['securitygroupids'] = securityGroup.id;
      this._deploy(params);
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
    e.preventDefault();
    this.deployVm();
    this.hide();
  }

  public onTemplateChange(t: Template): void {
    this.vmCreationData.vm.template = t;
  }

  public onDiskChange(e: number): void {
    if (e > this.vmCreationData.rootDiskSizeLimit) {
      this.vmCreationData.rootDiskSize = this.vmCreationData.rootDiskSizeLimit + 1;
      // setTimeout is used to force rerendering
      setTimeout(() => this.vmCreationData.rootDiskSize = this.vmCreationData.rootDiskSizeLimit);
      return;
    }
    this.vmCreationData.rootDiskSize = e;
  }

  public onDiskBlur(e: any): void {
    if (e.currentTarget.value < this.vmCreationData.rootDiskSizeMin) {
      this.vmCreationData.rootDiskSize = this.vmCreationData.rootDiskSize + 1;
      // setTimeout is used to force rerendering
      setTimeout(() => this.vmCreationData.rootDiskSize = this.vmCreationData.rootDiskSizeMin);
    }
  }

  private _deploy(params: {}): void {
    this.translateService.get([
      'VM_DEPLOY_IN_PROGRESS'
    ]).subscribe(strs => {
      let id = this.jobsNotificationService.add(strs['VM_DEPLOY_IN_PROGRESS']);
      this.vmService.deploy(params)
        .subscribe(result => {
          this.vmService.get(result.id)
            .subscribe(r => {
              r.state = 'Deploying';
              this.onCreated.next(r);
            });
          this.vmService.checkCommand(result.jobid)
            .subscribe(() => this.notifyOnDeployDone(id));
        });
    });
  }

  private getVmCreateData(): Observable<VmCreationData> {
    let vmCreationData = new VmCreationData();

    return Observable.forkJoin([
      this.zoneService.getList(),
      this.serviceOfferingFilterService.getAvailable(),
      this.diskStorageService.getAvailablePrimaryStorage(),
      this.affinityGroupService.getList(),
      this.sshService.getList(),
      this.templateService.getDefault()
    ]).map(result => {
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
    if (this.securityRules && this.securityRules.ingress) {
      params['ingress'] = this.securityRules.ingress;
    }
    if (this.securityRules && this.securityRules.egress) {
      params['egress'] = this.securityRules.egress;
    }
    return params;
  }
}
