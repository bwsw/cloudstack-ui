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
  GROUP_POSTFIX,
  InstanceGroup,
  InstanceGroupService,
  JobsNotificationService,
  SecurityGroupService,
  ZoneService
} from '../../shared';

import { BaseTemplateModel } from '../../template/shared';
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
import { VmCreationState } from './vm-creation-data/vm-creation-data';
import { VmCreationData, VmCreationService } from './vm-creation.service';
import { SecurityGroup } from '../../security-group/sg.model';
import { Rules } from '../../security-group/sg-creation/sg-creation.component';


@Component({
  selector: 'cs-vm-create',
  templateUrl: 'vm-creation.component.html',
  styleUrls: ['vm-creation.component.scss']
})
export class VmCreationComponent implements OnInit {
  public vmCreationData: VmCreationData;

  public affinityGroups: Array<AffinityGroup>;
  public affinityGroupTypes: Array<AffinityGroupType>;
  public diskOfferings: Array<DiskOffering>;
  public instanceGroups: Array<InstanceGroup>;
  public serviceOfferings: Array<ServiceOffering>;
  public sshKeyPairs: Array<SSHKeyPair>;
  public zones: Array<Zone>;

  public fetching: boolean;
  public enoughResources = true;

  public vmCreationState: VmCreationState;
  public keyboards = ['us', 'uk', 'jp', 'sc'];
  public noAffinityGroupTranslation: string;
  public keyboardTranslations: Object;

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
    private instanceGroupService: InstanceGroupService,
    private jobsNotificationService: JobsNotificationService,
    private resourceUsageService: ResourceUsageService,
    private securityGroupService: SecurityGroupService,
    private translateService: TranslateService,
    private utils: UtilsService,
    private vmCreationService: VmCreationService,
    private vmService: VmService,
    private zoneService: ZoneService,

    private formService: VmFormService
  ) {
    this.vmCreationState = new VmCreationState();

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

  public get affinityGroupNames(): Array<string> {
    return this.affinityGroups.map(affinityGroup => affinityGroup.name);
  }

  public get instanceGroupNames(): Array<string> {
    return this.instanceGroups.map(instanceGroup => instanceGroup.name);
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
        name: this.vmCreationState.affinityGroupName,
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

  public set zone(zone: Zone) {
    this.updateZone(zone).subscribe();
  }

  public get templateSelected(): boolean {
    return this.vmCreationState.template instanceof Template;
  }

  public get selectedZone(): Zone {
    return this.zones.find(zone => zone.id === this.zone.id);
  }

  public setDiskOffering(diskOffering: DiskOffering): void {
    this.vmCreationState.diskOffering = diskOffering;
  }

  public setServiceOffering(serviceOffering: ServiceOffering): void {
    this.vmCreationState.serviceOffering = serviceOffering;
  }

  public setTemplate(template: BaseTemplateModel): void {
    this.vmCreationState.template = template;
  }

  public setGroup(groupName: string): void {
    if (groupName) {
      this.vmCreationState.instanceGroup = new InstanceGroup(groupName);
    }
  }

  public affinityGroupChange(name): void {
    this.vmCreationState.affinityGroupName = name;
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
        if (!this.vmCreationState.displayName) {
          setTimeout(() => this.vmCreationState.displayName = defaultName);
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
      'serviceOfferingId': this.vmCreationState.serviceOffering.id,
      'templateId': this.vmCreationState.template.id,
      'zoneId': this.vmCreationState.zone.id,
      'keyPair': this.vmCreationState.keyPair,
      'keyboard': this.vmCreationState.keyboard,
      'response': 'json'
    };

    if (this.vmCreationState.customServiceOffering) {
      params['details'] = [{
        cpuNumber: this.vmCreationState.customServiceOffering.cpuNumber,
        cpuSpeed: this.vmCreationState.customServiceOffering.cpuSpeed,
        memory: this.vmCreationState.customServiceOffering.memory
      }];
    }

    if (this.vmCreationState.displayName) {
      params['name'] = this.vmCreationState.displayName;
    }
    const affinityGroupName = this.vmCreationState.affinityGroupName;
    if (affinityGroupName) {
      params['affinityGroupNames'] = affinityGroupName;
    }
    if (this.vmCreationState.diskOffering && !this.templateSelected) {
      params['diskofferingid'] = this.vmCreationState.diskOffering.id;
      params['hypervisor'] = 'KVM';
    }
    if (this.templateSelected || this.vmCreationState.showRootDiskResize) {
      const key = this.templateSelected ? 'rootDiskSize' : 'size';
      params[key] = this.vmCreationState.rootDiskSize;
    }
    if (!this.vmCreationState.doStartVm) {
      params['startVm'] = 'false';
    }
    if (this.vmCreationState.securityRules && this.vmCreationState.securityRules.ingress) {
      params['ingress'] = this.vmCreationState.securityRules.ingress;
    }
    if (this.vmCreationState.securityRules && this.vmCreationState.securityRules.egress) {
      params['egress'] = this.vmCreationState.securityRules.egress;
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
        if (this.vmCreationState.instanceGroup) {
          return this.instanceGroupService.add(vm, this.vmCreationState.instanceGroup);
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

  private getPreselectedRules(securityGroupTemplates: Array<SecurityGroup>): Rules {
    const preselectedSecurityGroups = securityGroupTemplates
      .filter(securityGroup => securityGroup.preselected);
    return Rules.createWithAllRulesSelected(preselectedSecurityGroups);
  }

  private setDiskOfferings(diskOfferings: Array<DiskOffering>): void {
    let filteredDiskOfferings = diskOfferings.filter((diskOffering: DiskOffering) => {
      return diskOffering.diskSize < this.vmCreationData.availablePrimaryStorage;
    });

    if (!filteredDiskOfferings.length) {
      // this.enoughResources = false;
    } else {
      this.diskOfferings = diskOfferings;
      this.vmCreationState.diskOffering = diskOfferings[0];
    }
  }

  private updateZone(zone: Zone): Observable<void> {
    this.vmCreationState.reset();
    this.vmCreationState.zone = zone;
    if (!zone || !this.vmCreationData || !this.zones) { return Observable.of(null); }

    this.serviceOfferings = [];
    this.vmCreationState.serviceOffering = new ServiceOffering({ id: null });
    this.diskOfferings = [];
    this.changeDetectorRef.detectChanges();
    this.vmCreationService.getData().subscribe(vmCreationData => {
      this.vmCreationData = vmCreationData;
      this.setDiskOfferings(vmCreationData.diskOfferings);
      this.vmCreationState.template = vmCreationData.defaultTemplate;
      this.vmCreationState.securityRules = this.getPreselectedRules(vmCreationData.securityGroupTemplates);
      this.changeDetectorRef.detectChanges();
      this.fetching = false;
    });
  }
}
