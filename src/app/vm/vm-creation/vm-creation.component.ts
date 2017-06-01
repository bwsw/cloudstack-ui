import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MdlDialogReference } from '@angular-mdl/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { TranslateService } from '@ngx-translate/core';

import { VirtualMachine } from '../shared/vm.model';

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
  SecurityGroupService,
  ServiceOfferingFilterService,
  SSHKeyPairService,
  UtilsService,
  ZoneService
} from '../../shared';

import { Rules } from '../../security-group/sg-creation/sg-creation.component';
import { BaseTemplateModel, TemplateService } from '../../template/shared';
import { VmService } from '../shared/vm.service';
import {
  CustomServiceOffering
} from '../../service-offering/custom-service-offering/custom-service-offering.component';
import { Template } from '../../template/shared';
import { AffinityGroupType } from '../../shared/models/affinity-group.model';
import { ResourceUsageService } from '../../shared/services/resource-usage.service';
import { DialogService } from '../../shared/services/dialog/dialog.service';


class VmCreationData {
  public vm: VirtualMachine;
  public affinityGroups: Array<AffinityGroup>;
  public affinityGroupNames: Array<string>;
  public affinityGroupTypes: Array<AffinityGroupType>;
  public instanceGroups: Array<string>;
  public serviceOfferings: Array<ServiceOffering>;
  public diskOfferings: Array<DiskOffering>;
  public sshKeyPairs: Array<SSHKeyPair>;
  public zones: Array<Zone>;
  public customServiceOffering: CustomServiceOffering;

  public affinityGroupId: string;
  public affinityGroupName: string;
  public doStartVm: boolean;
  public keyboard: string;
  public keyPair: string;
  public rootDiskSize: number;
  public rootDiskSizeMin: number;
  public rootDiskSizeLimit: number;

  public defaultName: string;

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
  public fetching: boolean;
  public enoughResources: boolean;

  public vmCreationData: VmCreationData;
  public keyboards = ['us', 'uk', 'jp', 'sc'];
  public noAffinityGroupTranslation: string;
  public keyboardTranslations: Object;
  public securityRules: Rules;

  public takenName: string;
  public sgCreationInProgress = false;
  public agCreationInProgress = false;

  public showRootDiskResize = false;
  public showSecurityGroups = true;
  private selectedDiskOffering: DiskOffering;

  constructor(
    private affinityGroupService: AffinityGroupService,
    private auth: AuthService,
    private changeDetectorRef: ChangeDetectorRef,
    private dialog: MdlDialogReference,
    private dialogService: DialogService,
    private diskOfferingService: DiskOfferingService,
    private diskStorageService: DiskStorageService,
    private instanceGroupService: InstanceGroupService,
    private jobsNotificationService: JobsNotificationService,
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
    this.fetching = true;
    this.enoughResources = true;
    this.resourceUsageService.getResourceUsage()
      .subscribe(resourceUsage => {
        if (resourceUsage.available.cpus &&
          resourceUsage.available.instances &&
          resourceUsage.available.volumes
        ) {
          this.resetVmCreateData();
        } else {
          this.fetching = false;
          this.enoughResources = false;
        }
      });

  }

  public setDiskOffering(offering: DiskOffering): void {
    this.showRootDiskResize = offering.isCustomized;
    this.selectedDiskOffering = offering;
  }

  public onVmCreationSubmit(e: any): void {
    e.preventDefault();
    this.deployVm();
  }

  public onCancel(): void {
    this.dialog.hide(Observable.of());
  }

  public resetVmCreateData(): void {
    Observable.forkJoin([
      this.getVmCreateData(),
      this.getDefaultVmName()
    ])
      .subscribe(([creationData, defaultName]) => {
        this.vmCreationData = creationData;
        this.zoneId = this.vmCreationData.vm.zoneId;

        if (!this.vmCreationData.vm.displayName) {
          this.vmCreationData.defaultName = defaultName;
          setTimeout(() => this.vmCreationData.vm.displayName = defaultName);
          this.changeDetectorRef.detectChanges();
        }
      });
  }

  public deployVm(): void {
    let params: any = this.vmCreateParams;

    let shouldCreateAffinityGroup = false;
    let affinityGroupName = params['affinityGroupNames'];
    if (affinityGroupName) {
      const ind = this.vmCreationData.affinityGroups.findIndex(ag => ag.name === affinityGroupName);
      if (ind === -1) {
        shouldCreateAffinityGroup = true;
      }
    }
    let securityGroupObservable = this.securityGroupService.createWithRules(
      { name: this.utils.getUniqueId() + GROUP_POSTFIX },
      params.ingress || [],
      params.egress || []
    )
      .map(securityGroup => {
        params['securityGroupIds'] = securityGroup.id;
      });

    let affinityGroupsObservable;
    if (shouldCreateAffinityGroup) {
      affinityGroupsObservable = this.affinityGroupService.create({
        name: this.vmCreationData.affinityGroupName,
        type: this.vmCreationData.affinityGroupTypes[0].type
      })
        .map(affinityGroup => {
          this.vmCreationData.affinityGroups.push(affinityGroup);
          this.vmCreationData.affinityGroupNames.push(affinityGroup.name);
          params['affinityGroupNames'] = affinityGroup.name;
          this.agCreationInProgress = false;
        });
    } else {
      affinityGroupsObservable = Observable.of(null);
    }

    delete params['ingress'];
    delete params['egress'];

    if (this.selectedZone.networkTypeIsBasic) {
      this.agCreationInProgress = shouldCreateAffinityGroup;
      affinityGroupsObservable
        .subscribe(() => {
          this.deploy(params);
        });
    } else {
      this.agCreationInProgress = shouldCreateAffinityGroup;
      affinityGroupsObservable
        .switchMap(() => {
          this.agCreationInProgress = false;
          this.sgCreationInProgress = true;
          return securityGroupObservable;
        })
        .subscribe(() => {
          this.sgCreationInProgress = false;
          this.deploy(params);
        });
    }
  }

  public showPassword(vmName: string, vmPassword: string): void {
    this.dialogService.customAlert({
      message: {
        translationToken: 'PASSWORD_DIALOG_MESSAGE',
        interpolateParams: { vmName, vmPassword }
      },
      width: '400px',
      clickOutsideToClose: false
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
    this.updateZone(id).subscribe();
  }

  public get templateSelected(): boolean {
    return this.vmCreationData.vm.template instanceof Template;
  }

  public get selectedZone(): Zone {
    return this.vmCreationData.zones.find(zone => zone.id === this.zoneId);
  }

  public setGroup(groupName: string): void {
    if (groupName) {
      this.vmCreationData.vm.instanceGroup = new InstanceGroup(groupName);
    }
  }

  public affinityGroupChange(name): void {
    this.vmCreationData.affinityGroupName = name;
  }

  public setTemplate(t: BaseTemplateModel): void {
    if (t && this.utils.convertToGB(t.size) < this.vmCreationData.rootDiskSizeLimit) {
      this.vmCreationData.vm.template = t;
      this.setMinDiskSize(t);
    } else {
      this.enoughResources = false;
    }
  }

  private getDefaultVmName(): Observable<string> {
    return this.vmService.getNumberOfVms()
      .map(numberOfVms => {
        return `vm-${this.auth.username}-${numberOfVms + 1}`;
      });
  }

  private getVmCreateData(): Observable<VmCreationData> {
    let vmCreationData = new VmCreationData();

    return this.zoneService.getList()
      .switchMap(zoneList => {
        vmCreationData.zones = zoneList;
        vmCreationData.vm.zoneId = zoneList[0].id;
        this.vmCreationData.vm.zoneId = zoneList[0].id;
        return this.updateZone(zoneList[0].id);
      })
      .switchMap(() => {
        return Observable.forkJoin([
          this.affinityGroupService.getList(),
          this.affinityGroupService.getTypes(),
          this.sshService.getList(),
          this.vmService.getInstanceGroupList(),
          this.securityGroupService.getTemplates()
        ]);
      })
      .map(([
        affinityGroups,
        affinityGroupTypes,
        sshKeyPairs,
        instanceGroups,
        securityGroupTemplates
      ]) => {
        vmCreationData.affinityGroups = <any>affinityGroups;
        vmCreationData.affinityGroupTypes = <any>affinityGroupTypes;
        vmCreationData.affinityGroupNames = affinityGroups.map(ag => ag.name);
        vmCreationData.sshKeyPairs = <any>sshKeyPairs;
        vmCreationData.instanceGroups = instanceGroups.map(group => group.name);

        let preselectedSecurityGroups = securityGroupTemplates.filter(securityGroup => securityGroup.preselected);
        this.securityRules = Rules.createWithAllRulesSelected(preselectedSecurityGroups);

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

    params['name'] = this.vmCreationData.vm.displayName || this.vmCreationData.defaultName;

    const affinityGroupName = this.vmCreationData.affinityGroupName;
    if (affinityGroupName) {
      params['affinityGroupNames'] = affinityGroupName;
    }
    if (this.selectedDiskOffering && !this.templateSelected) {
      params['diskofferingid'] = this.selectedDiskOffering.id;
      params['hypervisor'] = 'KVM';
    }
    if (this.templateSelected || this.showRootDiskResize) {
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
    return params;
  }

  private deploy(params): void {
    let deployObservable = new Subject();
    let notificationId: string;
    let deployResponseVm: any;

    this.vmService.deploy(params)
      .switchMap(deployResponse => {
        notificationId = this.jobsNotificationService.add('VM_DEPLOY_IN_PROGRESS');

        this.vmService.get(deployResponse.id)
          .subscribe(vm => {
            deployResponseVm = vm;
            vm.state = 'Deploying';
            deployObservable.next(vm);
            deployObservable.complete();
          });

        this.vmService.incrementNumberOfVms().subscribe();

        this.sgCreationInProgress = false;
        this.dialog.hide(deployObservable);
        return this.vmService.registerVmJob(deployResponse);
      })
      .switchMap(vm => {
        if (this.vmCreationData.vm.instanceGroup) {
          return this.instanceGroupService.add(vm, this.vmCreationData.vm.instanceGroup);
        }
        return Observable.of(vm);
      })
      .subscribe(
        vm => {
          if (vm.instanceGroup) {
            this.instanceGroupService.groupsUpdates.next();
          }

          this.notifyOnDeployDone(notificationId);
          if (!vm.password) {
            return;
          }

          this.showPassword(vm.displayName, vm.password);
          this.vmService.updateVmInfo(vm);
        },
        err => {
          if (deployResponseVm) {
            deployResponseVm.state = 'Error';
            this.vmService.updateVmInfo(deployResponseVm);
          }

          this.sgCreationInProgress = false;
          this.agCreationInProgress = false;
          this.translateService.get(err.message, err.params)
            .subscribe(str => this.dialogService.alert(str));

          this.notifyOnDeployFailed(notificationId);
        }
      );
  }

  private setServiceOfferings(serviceOfferings: Array<ServiceOffering>): void {
    if (!serviceOfferings.length) {
      this.enoughResources = false;
    }
    this.vmCreationData.serviceOfferings = serviceOfferings;
    this.setServiceOffering(serviceOfferings[0]);
  }

  private setDiskOfferings(diskOfferings: Array<DiskOffering>): void {
    let filteredDiskOfferings = diskOfferings.filter((diskOffering: DiskOffering) => {
      return diskOffering.diskSize < this.vmCreationData.rootDiskSizeLimit;
    });

    if (!filteredDiskOfferings.length) {
      this.enoughResources = false;
    } else {
      this.vmCreationData.diskOfferings = diskOfferings;
      this.setDiskOffering(diskOfferings[0]);
    }
  }

  private updateZone(id: string): Observable<void> {
    this.vmCreationData.vm.zoneId = id;
    this.vmCreationData.customServiceOffering = undefined;

    if (!id || !this.vmCreationData || !this.vmCreationData.zones) {
      return Observable.of(null);
    }

    this.showSecurityGroups = !this.vmCreationData.zones.find(zone => zone.id === id).networkTypeIsBasic;

    this.vmCreationData.serviceOfferings = [];
    this.vmCreationData.vm.serviceOfferingId = null;
    this.vmCreationData.diskOfferings = [];
    this.selectedDiskOffering = null;
    this.changeDetectorRef.detectChanges();

    return Observable.forkJoin([
      this.diskStorageService.getAvailablePrimaryStorage(),
      this.serviceOfferingFilterService.getAvailable({ zone: this.selectedZone }),
      this.diskOfferingService.getList({ zone: this.selectedZone, maxSize: this.vmCreationData.rootDiskSizeLimit }),
      this.templateService.getDefault(this.selectedZone.id, this.vmCreationData.rootDiskSizeLimit)
    ])
      .map(([
        rootDiskSizeLimit,
        serviceOfferings,
        diskOfferings,
        defaultTemplate]: [number, Array<ServiceOffering>, Array<DiskOffering>, BaseTemplateModel]
      ) => {
        this.vmCreationData.rootDiskSizeLimit = rootDiskSizeLimit;
        this.setServiceOfferings(serviceOfferings);
        this.setTemplate(defaultTemplate);
        this.setDiskOfferings(diskOfferings);
        this.fetching = false;
      });
  }
}
