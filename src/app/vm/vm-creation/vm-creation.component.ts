import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { MdlDialogReference } from '../../dialog/dialog-module';
import { DialogService } from '../../dialog/dialog-module/dialog.service';

import {
  DiskOffering,
  JobsNotificationService,
  ZoneService
} from '../../shared';

import { ServiceOffering, Zone } from '../../shared/models';
import { ResourceUsageService } from '../../shared/services/resource-usage.service';
import { Template } from '../../template/shared';

import { VmCreationState } from './vm-creation-data/vm-creation-state';
import { BaseField } from './vm-creation-field/base-field';
import { VmFormService } from './vm-form.service';
import { Rules } from '../../security-group/sg-creation/sg-creation.component';
import { VmCreationService } from './vm-creation.service';
import { VmCreationData } from './vm-creation-data/vm-creation-data';


@Component({
  selector: 'cs-vm-create',
  templateUrl: 'vm-creation.component.html',
  styleUrls: ['vm-creation.component.scss']
})
export class VmCreationComponent implements OnInit {
  public vmCreationData: VmCreationData;
  public vmCreationState: VmCreationState;

  public fetching: boolean;
  public enoughResources: boolean;
  public insufficientResources: Array<string> = [];
  public insufficientResourcesErrorMap = {
    instances: 'VM_CREATION_FORM.RESOURCES.INSTANCES',
    ips: 'VM_CREATION_FORM.RESOURCES.IPS',
    volumes: 'VM_CREATION_FORM.RESOURCES.VOLUMES',
    cpus: 'VM_CREATION_FORM.RESOURCES.CPUS',
    memory: 'VM_CREATION_FORM.RESOURCES.MEMORY',
    primaryStorage: 'VM_CREATION_FORM.RESOURCES.PRIMARYSTORAGE',
  };

  public noAffinityGroupTranslation: string;
  public securityRules: Rules;

  public takenName: string;
  public sgCreationInProgress = false;
  public agCreationInProgress = false;

  public fields: Array<BaseField<any>> = [];
  public form: FormGroup;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private dialog: MdlDialogReference,
    private dialogService: DialogService,
    private jobsNotificationService: JobsNotificationService,
    private resourceUsageService: ResourceUsageService,
    private translateService: TranslateService,
    private vmCreationService: VmCreationService,
    private zoneService: ZoneService,

    private formService: VmFormService
  ) {
    this.vmCreationService.getData().subscribe(vmCreationData => {
      this.vmCreationData = vmCreationData;
      this.vmCreationState = vmCreationData.getState();
    });

    this.translateService.get('NO_AFFINITY_GROUP').subscribe(str => {
      this.noAffinityGroupTranslation = str;
    });
  }

  public ngOnInit(): void {
    this.fetching = true;
    this.enoughResources = true;
    this.resourceUsageService.getResourceUsage()
      .subscribe(resourceUsage => {
        Object.keys(resourceUsage.available)
          .filter(key => key !== 'snapshots' && key !== 'secondaryStorage')
          .forEach(key => {
            const available = resourceUsage.available[key];
            if (available === 0) {
              this.insufficientResources.push(key);
            }
          });

        if (this.insufficientResources.length) {
          this.enoughResources = false;
          this.fetching = false;
        } else {
          this.resetVmCreateData();
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
    this.getVmCreateData().subscribe();
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
    return this.vmCreationState.zone;
  }

  public set zone(zone: Zone) {
    this.updateZone(zone).subscribe();
  }

  public get templateSelected(): boolean {
    return this.vmCreationState.template instanceof Template;
  }

  private getVmCreateData(): Observable<void> {
    return this.zoneService.getList()
      .switchMap(zoneList => {
        this.vmCreationData.zones = zoneList;
        return this.updateZone(zoneList[0]);
      });
  }

  private setDiskOfferings(diskOfferings: Array<DiskOffering>): void {
    let filteredDiskOfferings = diskOfferings.filter((diskOffering: DiskOffering) => {
      return diskOffering.diskSize < this.vmCreationData.availablePrimaryStorage;
    });

    if (!filteredDiskOfferings.length) {
      this.enoughResources = false;
      this.dialogService.alert('VM_CREATION_FORM.NO_DISK_OFFERING');
    } else {
      this.vmCreationData.diskOfferings = diskOfferings;
      this.vmCreationState.diskOffering = diskOfferings[0];
    }
  }

  private updateZone(zone: Zone): Observable<void> {
    this.vmCreationState.reset();
    this.vmCreationState.zone = zone;
    if (!zone || !this.vmCreationData || !this.vmCreationData.zones) { return Observable.of(null); }

    this.vmCreationState.serviceOffering = new ServiceOffering({ id: null });
    this.changeDetectorRef.detectChanges();
    this.vmCreationService.getData().subscribe(vmCreationData => {
      this.setDiskOfferings(vmCreationData.diskOfferings);
      this.vmCreationState.template = vmCreationData.defaultTemplate;
      this.vmCreationState.securityRules = this.vmCreationData.preselectedRules;
      this.changeDetectorRef.detectChanges();
      this.fetching = false;
    });
  }
}
