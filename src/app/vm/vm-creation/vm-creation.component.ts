import { Component, ViewChild, Output, EventEmitter, OnInit } from '@angular/core';
import { MdlDialogComponent, MdlDialogService, MdlDialogReference } from 'angular2-mdl';
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
export class VmCreationComponent implements OnInit {
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
    private dialogService: MdlDialogService,
    private dialog: MdlDialogReference
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

  public ngOnInit(): void {
    this.resetVmCreateData();
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

  public onVmCreationSubmit(e: any): void {
    e.preventDefault();
    this.dialog.hide(this.deployVm());
  }

  public onCancel(): void {
    this.dialog.hide();
  }

  public resetVmCreateData(): void {
    this.getVmCreateData().subscribe(result => {
      this.vmCreationData = result;
    });
  }

  public deployVm(): Observable<VirtualMachine> {
    let params: any = this.vmCreateParams;
    let notificationId: string;

    this.translateService.get([
      'VM_DEPLOY_IN_PROGRESS'
    ])
      .subscribe(strs => {
        notificationId = this.jobsNotificationService.add(strs['VM_DEPLOY_IN_PROGRESS']);
      });

    let observable = this.securityGroupService.createWithRules(
      { name: this.utils.getUniqueId() + GROUP_POSTFIX },
      params.ingress || [],
      params.egress || []
    )
      .switchMap(securityGroup => {
        params['securitygroupids'] = securityGroup.id;
        return this.vmService.deploy(params);
      })
      .publish();

    observable.connect();

    observable
      .switchMap(deployResponse => {
        return this.vmService.checkCommand(deployResponse.jobid)
      })
      .subscribe(job => {
        this.notifyOnDeployDone(notificationId);
        if (!job.jobResult.password) { return; }
        this.showPassword(job.jobResult.displayName, job.jobResult.password);
      });

    return observable
      .switchMap(deployResponse => this.vmService.get(deployResponse.id))
      .map(vm => {
        vm.state = 'Deploying';
        return vm;
      });
  }

  public showPassword(vmName: string, vmPassword: string): void {
    this.translateService.get(
      'PASSWORD_DIALOG_MESSAGE',
      { vmName, vmPassword }
    )
      .subscribe((passwordMessage: string) => {
        this.dialogService.alert(passwordMessage);
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

  public onTemplateChange(t: Template): void {
    this.vmCreationData.vm.template = t;
  }

  public setServiceOffering(offering: string): void {
    this.vmCreationData.vm.serviceOfferingId = offering;
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
