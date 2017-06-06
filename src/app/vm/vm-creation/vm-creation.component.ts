import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { TranslateService } from '@ngx-translate/core';

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
  ZoneService
} from '../../shared';

import { Rules } from '../../security-group/sg-creation/sg-creation.component';
import { BaseTemplateModel, TemplateService } from '../../template/shared';
import { VmService } from '../shared/vm.service';
import { Template } from '../../template/shared';
import { AffinityGroupType } from '../../shared/models/affinity-group.model';
import { ResourceUsageService } from '../../shared/services/resource-usage.service';
import { DialogService } from '../../dialog/dialog-module/dialog.service';
import { MdlDialogReference } from '../../dialog/dialog-module';
import { UtilsService } from '../../shared/services/utils.service';
import { FormGroup } from '@angular/forms';
import { BaseField } from './vm-creation-field/base-field';
import { VmFormService } from './vm-form.service';
import { VmCreationData } from './vm-creation-data/vm-creation-data';


@Component({
  selector: 'cs-vm-create',
  templateUrl: 'vm-creation.component.html',
  styleUrls: ['vm-creation.component.scss']
})
export class VmCreationComponent implements OnInit {
  public affinityGroups: Array<AffinityGroup>;
  public affinityGroupNames: Array<string>;
  public affinityGroupTypes: Array<AffinityGroupType>;
  public instanceGroups: Array<string>;
  public serviceOfferings: Array<ServiceOffering>;
  public diskOfferings: Array<DiskOffering>;
  public sshKeyPairs: Array<SSHKeyPair>;
  public zones: Array<Zone>;

  public fetching: boolean;
  public enoughResources = true;

  public vmCreationData: VmCreationData;
  public keyboards = ['us', 'uk', 'jp', 'sc'];
  public noAffinityGroupTranslation: string;
  public keyboardTranslations: Object;
  public securityRules: Rules;

  public takenName: string;
  public sgCreationInProgress = false;
  public agCreationInProgress = false;

  public fields: Array<BaseField<any>> = [];
  public form: FormGroup;

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
    private zoneService: ZoneService,

    private formService: VmFormService
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
        if (
          resourceUsage.available.cpus &&
          resourceUsage.available.instances &&
          resourceUsage.available.volumes
        ) {
          this.resetVmCreateData();
        } else {
          this.fetching = false;
          // this.enoughResources = false;
        }
      });
    // need to check if enough resources
    this.formService.toFormGroup(this.fields);
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
      this.setDefaultVmName()
    ]).subscribe();
  }

  public deployVm(): void {
    let params: any = this.vmCreateParams;

    let shouldCreateAffinityGroup = false;
    let affinityGroupName = params['affinityGroupNames'];
    if (affinityGroupName) {
      const ind = this.affinityGroups.findIndex(ag => ag.name === affinityGroupName);
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
        type: this.affinityGroupTypes[0].type
      })
        .map(affinityGroup => {
          this.affinityGroups.push(affinityGroup);
          this.affinityGroupNames.push(affinityGroup.name);
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

  public get zone(): Zone {
    return this.vmCreationData.zone;
  }

  public set zone(zone: Zone) {
    this.updateZone(zone).subscribe();
  }

  public get templateSelected(): boolean {
    return this.vmCreationData.template instanceof Template;
  }

  public get selectedZone(): Zone {
    return this.zones.find(zone => zone.id === this.zone.id);
  }

  public setDiskOffering(diskOffering: DiskOffering): void {
    this.vmCreationData.diskOffering = diskOffering;
  }

  public setServiceOffering(serviceOffering: ServiceOffering): void {
    this.vmCreationData.serviceOffering = serviceOffering;
  }

  public setTemplate(template: BaseTemplateModel): void {
    this.vmCreationData.template = template;
  }

  public setGroup(groupName: string): void {
    if (groupName) {
      this.vmCreationData.instanceGroup = new InstanceGroup(groupName);
    }
  }

  public affinityGroupChange(name): void {
    this.vmCreationData.affinityGroupName = name;
  }

  private getDefaultVmName(): Observable<string> {
    return this.vmService.getNumberOfVms()
      .map(numberOfVms => {
        return `vm-${this.auth.username}-${numberOfVms + 1}`;
      });
  }

  private setDefaultVmName(): Observable<void> {
    return this.getDefaultVmName()
      .map(defaultName => {
        if (!this.vmCreationData.displayName) {
          setTimeout(() => this.vmCreationData.displayName = defaultName);
          this.changeDetectorRef.detectChanges();
        }
      });
  }

  private getVmCreateData(): Observable<void> {
    return this.zoneService.getList()
      .switchMap(zoneList => {
        this.zones = zoneList;
        return this.updateZone(zoneList[0]);
      });
  }

  private get vmCreateParams(): {} {
    let params = {
      'serviceOfferingId': this.vmCreationData.serviceOffering.id,
      'templateId': this.vmCreationData.template.id,
      'zoneId': this.vmCreationData.zone.id,
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

    if (this.vmCreationData.displayName) {
      params['name'] = this.vmCreationData.displayName;
    }
    const affinityGroupName = this.vmCreationData.affinityGroupName;
    if (affinityGroupName) {
      params['affinityGroupNames'] = affinityGroupName;
    }
    if (this.vmCreationData.diskOffering && !this.templateSelected) {
      params['diskofferingid'] = this.vmCreationData.diskOffering.id;
      params['hypervisor'] = 'KVM';
    }
    if (this.templateSelected || this.vmCreationData.showRootDiskResize) {
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
        if (this.vmCreationData.instanceGroup) {
          return this.instanceGroupService.add(vm, this.vmCreationData.instanceGroup);
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
      // this.enoughResources = false;
    }
    this.serviceOfferings = serviceOfferings;
    this.vmCreationData.serviceOffering = serviceOfferings[0];
  }

  private setDiskOfferings(diskOfferings: Array<DiskOffering>): void {
    let filteredDiskOfferings = diskOfferings.filter((diskOffering: DiskOffering) => {
      return diskOffering.diskSize < this.vmCreationData.rootDiskSizeLimit;
    });

    if (!filteredDiskOfferings.length) {
      // this.enoughResources = false;
    } else {
      this.diskOfferings = diskOfferings;
      this.vmCreationData.diskOffering = diskOfferings[0];
    }
  }

  private updateZone(zone: Zone): Observable<void> {
    this.vmCreationData.reset();
    this.vmCreationData.zone = zone;

    if (!zone || !this.vmCreationData || !this.zones) {
      return Observable.of(null);
    }

    this.serviceOfferings = [];
    this.vmCreationData.serviceOffering = new ServiceOffering({ id: null });
    this.diskOfferings = [];
    this.changeDetectorRef.detectChanges();

    return Observable.forkJoin([
      this.affinityGroupService.getList(),
      this.affinityGroupService.getTypes(),
      this.sshService.getList(),
      this.vmService.getInstanceGroupList(),
      this.securityGroupService.getTemplates(),

      this.diskStorageService.getAvailablePrimaryStorage(),
      this.serviceOfferingFilterService.getAvailable({ zone: this.selectedZone }),
      this.diskOfferingService.getList({ zone: this.selectedZone, maxSize: this.vmCreationData.rootDiskSizeLimit }),
      this.templateService.getDefault(this.selectedZone.id, this.vmCreationData.rootDiskSizeLimit)
    ])
      .map(([
        affinityGroups,
        affinityGroupTypes,
        sshKeyPairs,
        instanceGroups,
        securityGroupTemplates,

        rootDiskSizeLimit,
        serviceOfferings,
        diskOfferings,
        defaultTemplate]
      ) => {
        this.affinityGroups = <any>affinityGroups;
        this.affinityGroupTypes = <any>affinityGroupTypes;
        this.affinityGroupNames = affinityGroups.map(ag => ag.name);
        this.sshKeyPairs = <any>sshKeyPairs;
        this.instanceGroups = instanceGroups.map(group => group.name);

        let preselectedSecurityGroups = securityGroupTemplates.filter(securityGroup => securityGroup.preselected);
        this.securityRules = Rules.createWithAllRulesSelected(preselectedSecurityGroups);

        if (sshKeyPairs.length) {
          this.vmCreationData.keyPair = sshKeyPairs[0].name;
        }

        this.vmCreationData.rootDiskSizeLimit = rootDiskSizeLimit;
        this.setServiceOfferings(serviceOfferings);
        this.vmCreationData.template = defaultTemplate;
        this.setDiskOfferings(diskOfferings);

        this.changeDetectorRef.detectChanges();
        this.fetching = false;
    });
  }
}
