import { Component, ViewChild, Output, EventEmitter, OnInit, ChangeDetectorRef } from '@angular/core';
import { MdlDialogComponent, MdlDialogService, MdlDialogReference } from 'angular2-mdl';
import { Observable, Subject } from 'rxjs/Rx';
import { TranslateService } from 'ng2-translate';

import { VirtualMachine, MAX_ROOT_DISK_SIZE_ADMIN } from '../shared/vm.model';

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
  DiskOfferingService,
  DiskStorageService,
  GROUP_POSTFIX,
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
import {
  CustomServiceOffering
} from '../../service-offering/custom-service-offering/custom-service-offering.component';
import { Template } from '../../template/shared/template.model';


class VmCreationData {
  public vm: VirtualMachine;
  public affinityGroups: Array<AffinityGroup>;
  public instanceGroups: Array<InstanceGroup>;
  public serviceOfferings: Array<ServiceOffering>;
  public diskOfferings: Array<DiskOffering>;
  public sshKeyPairs: Array<SSHKeyPair>;
  public zones: Array<Zone>;
  public customServiceOffering: CustomServiceOffering;

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
    this.rootDiskSize = 1;
    this.rootDiskSizeMin = 1;
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

  public fetching = false;

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
    private changeDetectorRef: ChangeDetectorRef,
    private dialog: MdlDialogReference,
    private dialogService: MdlDialogService,
    private diskOfferingService: DiskOfferingService,
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
  }

  public updateDiskOffering(offering: DiskOffering): void {
    this.showRootDiskResize = offering.isCustomized;
    this.selectedDiskOffering = offering;
  }

  // todo
  public show(): void {
    this.templateService.getDefault().subscribe(() => {
      this.serviceOfferingFilterService.getAvailable({ zoneId: this.zoneId })
        .subscribe(() => {
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
    this.fetching = true;
    Observable.forkJoin([
      this.getVmCreateData(),
      this.getDefaultVmName()
    ])
      .subscribe(([creationData, defaultName]) => {
        this.vmCreationData = creationData;
        this.zoneId = this.vmCreationData.vm.zoneId;

        this.setMinDiskSize();
        this.fetching = false;

        if (!this.vmCreationData.vm.displayName) {
          setTimeout(() => this.vmCreationData.vm.displayName = defaultName);
          this.changeDetectorRef.detectChanges();
        }
      });
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
        notificationId = this.jobsNotificationService.add('VM_DEPLOY_IN_PROGRESS');

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
        vm => {
          this.notifyOnDeployDone(notificationId);
          if (!vm.password) {
            return;
          }
          this.showPassword(vm.displayName, vm.password);
          this.vmService.updateVmInfo(vm);
        },
        err => {
          this.sgCreationInProgress = false;
          const response = err;
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
    this.jobsNotificationService.finish({
      id: notificationId,
      message: 'DEPLOY_DONE'
    });
  }

  public notifyOnDeployFailed(notificationId: string): void {
    this.jobsNotificationService.fail({
      id: notificationId,
      message: 'DEPLOY_FAILED'
    });
  }

  public onTemplateChange(t: BaseTemplateModel): void {
    this.vmCreationData.vm.template = t;

    this.setMinDiskSize(t);
  }

  public setServiceOffering(offering: ServiceOffering): void {
    this.vmCreationData.vm.serviceOfferingId = offering.id;
    if (offering.isCustomized) {
      this.vmCreationData.customServiceOffering = new CustomServiceOffering(
        offering.cpuNumber,
        offering.cpuSpeed,
        offering.memory
      );
    } else {
      this.vmCreationData.customServiceOffering = null;
    }
  }

  public get zoneId(): string {
    return this.vmCreationData.vm.zoneId;
  }

  public set zoneId(id: string) {
    this.vmCreationData.vm.zoneId = id;
    this.vmCreationData.customServiceOffering = undefined;
    this.changeDetectorRef.detectChanges();

    if (this.vmCreationData && this.vmCreationData.zones) {
      this.showSecurityGroups = !this.vmCreationData.zones.find(zone => zone.id === id).networkTypeIsBasic;

      this.vmCreationData.serviceOfferings = [];
      this.vmCreationData.vm.serviceOfferingId = null;
      this.vmCreationData.diskOfferings = [];
      this.selectedDiskOffering = null;
      this.changeDetectorRef.detectChanges();

      Observable.forkJoin([
        this.serviceOfferingFilterService.getAvailable({ zoneId: id }),
        this.diskOfferingService.getList({ zoneId: id })
      ])
        .subscribe(([serviceOfferings, diskOfferings]) => {
          this.vmCreationData.serviceOfferings = serviceOfferings;
          this.vmCreationData.diskOfferings = diskOfferings;
          this.changeDetectorRef.detectChanges();
        });
    }
  }

  public get templateSelected(): boolean {
    return this.vmCreationData.vm.template instanceof Template;
  }

  public setGroup(group: string): void {
    this.vmCreationData.vm.group = group;
  }

  private getDefaultVmName(): Observable<string> {
    const regex = /vm-.*-(\d+)/;

    return this.vmService.getList({}, true)
      .map(vmList => {
        let max = 0;
        vmList.forEach(vm => {
          const match = vm.displayName.match(regex);

          if (match && +match[1] > max) {
            max = +match[1];
          }
        });

        return `vm-${this.auth.username}-${++max}`;
      });
  }

  private getVmCreateData(): Observable<VmCreationData> {
    let vmCreationData = new VmCreationData();

    return this.zoneService.getList()
      .switchMap(zoneList => {
        vmCreationData.zones = zoneList;
        vmCreationData.vm.zoneId = zoneList[0].id;

        return Observable.forkJoin([
          this.diskStorageService.getAvailablePrimaryStorage(),
          this.affinityGroupService.getList(),
          this.sshService.getList(),
          this.templateService.getDefault(),
          this.instanceGroupService.getList(),
          this.diskOfferingService.getList({ zoneId: vmCreationData.vm.zoneId }),
          this.securityGroupService.getTemplates()
        ]);
      })
      .map(([
        rootDiskSizeLimit,
        affinityGroups,
        sshKeyPairs,
        template,
        instanceGroups,
        diskOfferings,
        securityGroupTemplates
      ]) => {
        vmCreationData.rootDiskSizeLimit = rootDiskSizeLimit;
        vmCreationData.affinityGroups = affinityGroups;
        vmCreationData.sshKeyPairs = sshKeyPairs;
        vmCreationData.vm.template = template;
        vmCreationData.instanceGroups = instanceGroups.map(group => group.name);
        vmCreationData.diskOfferings = diskOfferings;

        let preselectedSecurityGroups = securityGroupTemplates.filter(securityGroup => securityGroup.preselected);
        this.securityRules = Rules.createWithAllRulesSelected(preselectedSecurityGroups);

        if (rootDiskSizeLimit === -1) {
          vmCreationData.rootDiskSizeLimit = MAX_ROOT_DISK_SIZE_ADMIN;
        }
        if (sshKeyPairs.length) {
          vmCreationData.vm.keyPair = sshKeyPairs[0].name;
        }
        this.changeDetectorRef.detectChanges();
        return vmCreationData;
      });
  }

  private setMinDiskSize(template?: BaseTemplateModel): void {
    const t = template || this.vmCreationData.vm.template;
    if (!t) {
      throw new Error('Template was not passed to set disk size');
    }

    if (t instanceof Template) {
      const newSize = t.size / Math.pow(2, 30);
      this.vmCreationData.rootDiskSizeMin = newSize;
      this.vmCreationData.rootDiskSize = newSize;
    } else {
      this.vmCreationData.rootDiskSizeMin = 1;
      this.vmCreationData.rootDiskSize = 1;
    }
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

    if (this.vmCreationData.customServiceOffering) {
      params['details'] = [{
        cpuNumber: this.vmCreationData.customServiceOffering.cpuNumber,
        cpuSpeed: this.vmCreationData.customServiceOffering.cpuSpeed,
        memory: this.vmCreationData.customServiceOffering.memory
      }];
    }

    if (this.vmCreationData.vm.displayName) {
      params['name'] = this.vmCreationData.vm.displayName;
    }
    if (this.vmCreationData.affinityGroupId) {
      params['affinityGroupIds'] = this.vmCreationData.affinityGroupId;
    }
    if (this.selectedDiskOffering && !this.templateSelected) {
      params['diskofferingid'] = this.selectedDiskOffering.id;
      params['hypervisor'] = 'KVM';
    }
    if (this.showRootDiskResize) {
      const key = this.templateSelected ? 'rootDiskSize' : 'size';
      params[key] = this.vmCreationData.rootDiskSize;
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
