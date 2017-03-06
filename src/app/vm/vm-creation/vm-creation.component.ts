import { Component, ViewChild, Output, EventEmitter, OnInit } from '@angular/core';
import { MdlDialogComponent, MdlDialogService, MdlDialogReference } from 'angular2-mdl';
import { Observable, Subject } from 'rxjs/Rx';
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
  AuthService,
  DiskOffering,
  DiskStorageService,
  GROUP_POSTFIX,
  INotificationStatus,
  InstanceGroup,
  InstanceGroupService,
  JobsNotificationService,
  NotificationService,
  ResourceUsageService,
  SecurityGroupService,
  ServiceOfferingFilterService,
  SSHKeyPairService,
  UtilsService,
  ZoneService
} from '../../shared';

import { BaseTemplateModel } from '../../template/shared/base-template.model';
import { Rules } from '../../security-group/sg-creation/sg-creation.component';
import { TemplateService } from '../../template/shared';
import { VmService } from '../shared/vm.service';


class VmCreationData {
  public vm: VirtualMachine;
  public affinityGroups: Array<AffinityGroup>;
  public instanceGroups: Array<InstanceGroup>;
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

  public takenName: string;
  public sgCreationInProgress = false;

  public showRootDiskResize = false;
  public showSecurityGroups = true;
  private selectedDiskOffering: DiskOffering;

  constructor(
    private affinityGroupService: AffinityGroupService,
    private auth: AuthService,
    private dialog: MdlDialogReference,
    private dialogService: MdlDialogService,
    private diskStorageService: DiskStorageService,
    private instanceGroupService: InstanceGroupService,
    private jobsNotificationService: JobsNotificationService,
    private notificationService: NotificationService,
    private resourceUsageService: ResourceUsageService,
    private securityGroupService: SecurityGroupService,
    private serviceOfferingFilterService: ServiceOfferingFilterService,
    private sshService: SSHKeyPairService,
    private templateService: TemplateService,
    private translateService: TranslateService,
    private utils: UtilsService,
    private vmService: VmService,
    private zoneService: ZoneService
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
    this.setDefaultVmName();
  }

  public updateDiskOffering(offering: DiskOffering): void {
    this.showRootDiskResize = offering.isCustomized;
    this.selectedDiskOffering = offering;
  }

  // todo
  public show(): void {
    this.templateService.getDefault().subscribe(() => {
      this.serviceOfferingFilterService.getAvailable().subscribe(() => {
        this.resourceUsageService.getResourceUsage().subscribe(result => {
          if (result.available.primaryStorage > this.vmCreationData.rootDiskSizeMin && result.available.instances) {
          } else {
            this.translateService.get('INSUFFICIENT_RESOURCES')
              .subscribe(str => this.notificationService.error(str));
          }
        });
      }, () => {
        this.translateService.get('INSUFFICIENT_RESOURCES')
          .subscribe(str => this.notificationService.error(str));
      });
    }, () => {
      this.translateService.get('UNABLE_TO_RECEIVE_TEMPLATES')
        .subscribe(str => this.notificationService.error(str));
    });
  }

  public onVmCreationSubmit(e: any): void {
    e.preventDefault();
    this.deployVm();
  }

  public onCancel(): void {
    this.dialog.hide(Observable.of());
  }

  public resetVmCreateData(): void {
    this.getVmCreateData()
      .subscribe(result => this.vmCreationData = result);
  }

  public deployVm(): void {
    let deployObservable = new Subject();

    let notificationId: string;
    let params: any = this.vmCreateParams;
    this.sgCreationInProgress = true;

    this.securityGroupService.createWithRules(
      { name: this.utils.getUniqueId() + GROUP_POSTFIX },
      params.ingress || [],
      params.egress || []
    )
      .switchMap(securityGroup => {
        params['securityGroupIds'] = securityGroup.id;
        return this.vmService.deploy(params);
      })
      .switchMap(deployResponse => {
        this.translateService.get('VM_DEPLOY_IN_PROGRESS')
          .subscribe(str => notificationId = this.jobsNotificationService.add(str));

        this.vmService.get(deployResponse.id)
          .subscribe(vm => {
            vm.state = 'Deploying';
            deployObservable.next(vm);
            deployObservable.complete();
          });

        this.sgCreationInProgress = false;
        this.dialog.hide(deployObservable);
        return this.vmService.registerVmJob(deployResponse);
      })
      .subscribe(
        job => {
          this.notifyOnDeployDone(notificationId);
          if (!job.jobResult.password) {
            return;
          }
          this.showPassword(job.jobResult.displayName, job.jobResult.password);
          this.vmService.updateVmInfo(job.jobResult);
        },
        err => {
          this.sgCreationInProgress = false;
          const response = err.json()[`deployvirtualmachineresponse`];
          if (response && response.cserrorcode === 4350) {
            this.takenName = this.vmCreationData.vm.displayName;
            this.translateService.get(
              'THE_NAME_IS_TAKEN',
              { name: this.vmCreationData.vm.displayName }
            )
              .subscribe(str => this.dialogService.alert(str));

            return;
          }

          this.notifyOnDeployFailed(notificationId);
        }
      );
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

  public notifyOnDeployDone(notificationId: string): void {
    this.translateService.get('DEPLOY_DONE')
      .subscribe(str => {
        this.jobsNotificationService.add({
          id: notificationId,
          message: str,
          status: INotificationStatus.Finished
        });
      });
  }

  public notifyOnDeployFailed(notificationId: string): void {
    this.translateService.get('DEPLOY_FAILED')
      .subscribe(str => {
        this.jobsNotificationService.add({
          id: notificationId,
          message: str,
          status: INotificationStatus.Failed
        });
      });
  }

  public onTemplateChange(t: BaseTemplateModel): void {
    this.vmCreationData.vm.template = t;
  }

  public setServiceOffering(offering: string): void {
    this.vmCreationData.vm.serviceOfferingId = offering;
  }

  public get zoneId(): string {
    return this.vmCreationData.vm.zoneId;
  }

  public set zoneId(id: string) {
    this.vmCreationData.vm.zoneId = id;
    if (this.vmCreationData && this.vmCreationData.zones) {
      this.showSecurityGroups = this.vmCreationData.zones.find(zone => zone.id === id).securityGroupsEnabled;
    }
  }

  private setDefaultVmName(): void {
    const regex = /vm-.*-(\d+)/;

    this.vmService.getList({}, true)
      .subscribe(vmList => {
        let max = 0;
        vmList.forEach(vm => {
          const match = vm.displayName.match(regex);

          if (match && +match[1] > max) {
            max = +match[1];
          }
        });

        if (!this.vmCreationData.vm.displayName) {
          setTimeout(() => this.vmCreationData.vm.displayName = `vm-${this.auth.username}-${++max}`);
        }
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
      this.templateService.getDefault(),
      this.instanceGroupService.getList()
    ])
      .map(result => {
        vmCreationData.zones = result[0];
        vmCreationData.serviceOfferings = result[1];
        vmCreationData.rootDiskSizeLimit = result[2];
        vmCreationData.affinityGroups = result[3];
        vmCreationData.sshKeyPairs = result[4];
        vmCreationData.vm.template = result[5];
        vmCreationData.instanceGroups = result[6].map(group => group.name);
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
    if (this.selectedDiskOffering) {
      params['diskofferingid'] = this.selectedDiskOffering.id;
      params['hypervisor'] = 'KVM';
    }
    if (this.showRootDiskResize && this.vmCreationData.rootDiskSize >= 10) {
      params['size'] = this.vmCreationData.rootDiskSize;
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
    if (this.vmCreationData.vm.group) {
      params['group'] = this.vmCreationData.vm.group;
    }
    return params;
  }
}
