import { Component, ViewChild, Output, EventEmitter } from '@angular/core';
import { MdlDialogComponent, MdlDialogService } from 'angular2-mdl';
import { Observable } from 'rxjs/Rx';
import { TranslateService } from 'ng2-translate';

import { VirtualMachine, MIN_ROOT_DISK_SIZE, MAX_ROOT_DISK_SIZE_ADMIN } from '../shared/vm.model';

import {
  AffinityGroup,
  ServiceOffering,
  SSHKeyPair,
  Zone
} from '../../shared/models';

import {
  AffinityGroupService,
  SSHKeyPairService,
  DiskStorageService,
  GROUP_POSTFIX,
  INotificationStatus,
  JobsNotificationService,
  NotificationService,
  ResourceUsageService,
  SecurityGroupService,
  ServiceOfferingFilterService,
  UtilsService,
  ZoneService
} from '../../shared/services';
import { VmService } from '../shared/vm.service';
import { Template, TemplateService } from '../../template/shared';

import { Rules } from '../../security-group/sg-creation/sg-creation.component';


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
  public noAffinityGroupTranslation: string;
  public keyboardTranslations: Object;
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
    private securityGroupService: SecurityGroupService,
    private utils: UtilsService,
    private dialogService: MdlDialogService
  ) {
    this.vmCreationData = new VmCreationData();

    this.translateService.get('NO_AFFINITY_GROUP').subscribe(str => {
      this.noAffinityGroupTranslation = str;
    });

    this.translateService.get(
      this.keyboards.map(kb => { return 'KB_' + kb.toUpperCase(); })
    )
      .subscribe(strs => {
        let keyboardTranslations = {};
        this.keyboards.forEach(kb => keyboardTranslations[kb] = strs['KB_' + kb.toUpperCase()]);
        this.keyboardTranslations = keyboardTranslations;
      });
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
    let id;
    this.translateService.get([
      'VM_DEPLOY_IN_PROGRESS'
    ]).switchMap(strs => {
      id = this.jobsNotificationService.add(strs['VM_DEPLOY_IN_PROGRESS']);
      return this.securityGroupService.createWithRules(
        {
          name: this.utils.getUniqueId() + GROUP_POSTFIX
        },
        params.ingress || [],
        params.egress || []
      );
    })
    .subscribe(securityGroup => {
      params['securityGroupIds'] = securityGroup.id;
      this._deploy(params, id);
    });
  }

  public notifyOnDeployDone(notificationId: string): void {
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

  private _deploy(params: {}, notificationId): void {
    this.vmService.deploy(params)
      .subscribe(result => {
        this.vmService.get(result.id)
          .subscribe(r => {
            r.state = 'Deploying';
            this.onCreated.next(r);
          });
        this.vmService.checkCommand(result.jobid)
          .subscribe(job => {
            this.notifyOnDeployDone(notificationId);
            if (!job.jobResult.password) {
              return;
            }
            this.translateService.get(
              'PASSWORD_DIALOG_MESSAGE',
              {
                vmName: job.jobResult.displayName,
                vmPassword: job.jobResult.password
              }
            )
              .subscribe((res: string) => {
                this.dialogService.alert(res);
              });
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
      'serviceOfferingId': this.vmCreationData.vm.serviceOfferingId,
      'templateId': this.vmCreationData.vm.template.id,
      'zoneId': this.vmCreationData.vm.zoneId,
      'keyPair': this.vmCreationData.keyPair,
      'keyboard': this.vmCreationData.keyboard,
      'response': 'json'
    };

    if (this.vmCreationData.vm.displayName) {
      params['name'] = this.vmCreationData.vm.displayName;
    }
    if (this.vmCreationData.affinityGroupId) {
      params['affinityGroupIds'] = this.vmCreationData.affinityGroupId;
    }
    if (this.vmCreationData.rootDiskSize >= 10) {
      params['rootDiskSize'] = this.vmCreationData.rootDiskSize;
    }
    if (!this.vmCreationData.doStartVm) {
      params['startVm'] = 'false';
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
