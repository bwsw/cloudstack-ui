import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { SgRulesComponent } from '../../security-group/sg-rules/sg-rules.component';

import { SecurityGroup } from '../../security-group/sg.model';
import {
  ServiceOfferingDialogComponent
} from '../../service-offering/service-offering-dialog/service-offering-dialog.component';
import { Color, InstanceGroup, ServiceOfferingFields, ServiceOffering } from '../../shared/models';
import { ConfigService, InstanceGroupService } from '../../shared/services';
import { TagService } from '../../shared/services/tag.service';
import { ZoneService } from '../../shared/services/zone.service';
import { VirtualMachine } from '../shared/vm.model';
import { VmService } from '../shared/vm.service';
import { ServiceOfferingService } from '../../shared/services/service-offering.service';
import { DialogService } from '../../dialog/dialog-module/dialog.service';
import { AffinityGroupComponent } from './affinity-group.component';
import { AffinityGroup } from '../../shared/models/affinity-group.model';


@Component({
  selector: 'cs-vm-detail',
  templateUrl: 'vm-detail.component.html',
  styleUrls: ['vm-detail.component.scss']
})
export class VmDetailComponent implements OnChanges, OnInit {
  @Input() public vm: VirtualMachine;
  public color: Color;
  public colorList: Array<Color>;
  public description: string;
  public disableSecurityGroup = false;
  public expandNIC: boolean;
  public expandServiceOffering: boolean;
  public groupName: string;
  public groupNames: Array<string>;

  constructor(
    private dialogService: DialogService,
    private instanceGroupService: InstanceGroupService,
    private serviceOfferingService: ServiceOfferingService,
    private tagService: TagService,
    private vmService: VmService,
    private zoneService: ZoneService,
    private configService: ConfigService
  ) {
    this.expandNIC = false;
    this.expandServiceOffering = false;
  }

  public ngOnInit(): void {
    this.configService.get('vmColors')
      .subscribe(colors => this.colorList = colors);
  }

  public ngOnChanges(): void {
    this.update();
  }

  public get doShowChangeGroupButton(): boolean {
    let groupWasEmpty = !this.vm.instanceGroup && !!this.groupName;
    let groupChanged = this.vm.instanceGroup && this.vm.instanceGroup.name !== this.groupName;
    return groupWasEmpty || groupChanged;
  }

  public changeGroup(): void {
    let instanceGroup = new InstanceGroup(this.groupName);
    this.instanceGroupService.add(this.vm, instanceGroup)
      .subscribe(vm => {
        this.instanceGroupService.groupsUpdates.next();
        this.vmService.updateVmInfo(vm);
        this.updateGroups();
      });
  }

  public changeColor(color: Color): void {
    this.tagService.update(this.vm, 'UserVm', 'color', color.value)
      .subscribe(vm => {
        this.vm = vm;
        this.vmService.updateVmInfo(this.vm);
      });
  }

  public changeServiceOffering(): void {
    this.dialogService.showCustomDialog({
      component: ServiceOfferingDialogComponent,
      classes: 'service-offering-dialog',
      providers: [{ provide: 'virtualMachine', useValue: this.vm }],
    }).switchMap(res => res.onHide())
      .subscribe((newOffering: ServiceOffering) => {
        if (newOffering) {
          this.serviceOfferingService.get(newOffering.id).subscribe(offering => {
            this.vm.serviceOffering = offering;
          });
        }
      });
  }

  public changeDescription(newDescription: string): void {
    this.vmService
      .updateDescription(this.vm, newDescription)
      .onErrorResumeNext()
      .subscribe();
  }

  public changeAffinityGroup(): void {
    this.dialogService.showCustomDialog({
      component: AffinityGroupComponent,
      styles: { width: '350px' },
      providers: [{ provide: 'virtualMachine', useValue: this.vm }],
    }).switchMap(dialog => dialog.onHide())
      .subscribe((group?: Array<AffinityGroup>) => {
        if (group) {
          this.vm.affinityGroup = group;
        }
      });
  }

  public isNotFormattedField(key: string): boolean {
    return [
      ServiceOfferingFields.id,
      ServiceOfferingFields.created,
      ServiceOfferingFields.diskBytesReadRate,
      ServiceOfferingFields.diskBytesWriteRate,
      ServiceOfferingFields.storageType,
      ServiceOfferingFields.provisioningType
    ].indexOf(key) === -1;
  }

  public isTranslatedField(key: string): boolean {
    return [
      ServiceOfferingFields.storageType,
      ServiceOfferingFields.provisioningType
    ].indexOf(key) > -1;
  }

  public isDateField(key: string): boolean {
    return key === ServiceOfferingFields.created;
  }

  public isDiskStatsField(key: string): boolean {
    return [
      ServiceOfferingFields.diskBytesReadRate,
      ServiceOfferingFields.diskBytesWriteRate
    ].indexOf(key) > -1;
  }

  public toggleNIC(): void {
    this.expandNIC = !this.expandNIC;
  }

  public toggleServiceOffering(): void {
    this.expandServiceOffering = !this.expandServiceOffering;
  }

  public showRulesDialog(securityGroup: SecurityGroup): void {
    this.dialogService.showCustomDialog({
      component: SgRulesComponent,
      providers: [{ provide: 'securityGroup', useValue: securityGroup }],
      styles: { 'width': '880px' },
    });
  }

  public confirmAddSecondaryIp(vm: VirtualMachine): void {
    this.dialogService.confirm('ARE_YOU_SURE_ADD_SECONDARY_IP', 'NO', 'YES')
      .onErrorResumeNext()
      .subscribe(() => this.addSecondaryIp(vm));
  }

  public confirmRemoveSecondaryIp(secondaryIpId: string, vm: VirtualMachine): void {
    this.dialogService.confirm('ARE_YOU_SURE_REMOVE_SECONDARY_IP', 'NO', 'YES')
      .onErrorResumeNext()
      .subscribe(() => this.removeSecondaryIp(secondaryIpId, vm));
  }

  private update(): void {
    this.updateColor();
    this.updateGroups();
    this.updateDescription();

    this.checkSecurityGroupDisabled();
    if (this.vm.instanceGroup) {
      this.groupName = this.vm.instanceGroup.name;
    } else {
      this.groupName = undefined;
    }
  }

  private addSecondaryIp(vm: VirtualMachine): void {
    this.vmService.addIpToNic(vm.nic[0].id)
      .subscribe(
        res => {
          const ip = res.result.nicsecondaryip;
          vm.nic[0].secondaryIp.push(ip);
        },
        err => this.dialogService.alert(err.errortext)
      );
  }

  private removeSecondaryIp(secondaryIpId: string, vm: VirtualMachine): void {
    this.vmService.removeIpFromNic(secondaryIpId)
      .subscribe(
        () => {
          vm.nic[0].secondaryIp = vm.nic[0].secondaryIp.filter(ip => ip.id !== secondaryIpId);
        },
        err => this.dialogService.alert(err.errortext)
      );
  }

  private updateColor(): void {
    this.color = this.vmService.getColor(this.vm);
  }

  private updateGroups(): void {
    this.vmService.getInstanceGroupList().subscribe(groups => {
      this.groupNames = groups.map(group => group.name);
    });
  }

  private updateDescription(): void {
    this.vmService.getDescription(this.vm)
      .subscribe(description => {
        this.description = description;
      });
  }

  private checkSecurityGroupDisabled(): void {
    this.zoneService.get(this.vm.zoneId)
      .subscribe(zone => this.disableSecurityGroup = zone.networkTypeIsBasic);
  }
}
