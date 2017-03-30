import {
  Component,
  Input,
  OnChanges
} from '@angular/core';
import { MdlDialogService } from 'angular2-mdl';
import { TranslateService } from 'ng2-translate';

import { TagService } from '../../shared';
import { SecurityGroup } from '../../security-group/sg.model';
import {
  ServiceOfferingDialogComponent
} from '../../service-offering/service-offering-dialog/service-offering-dialog.component';
import { SgRulesComponent } from '../../security-group/sg-rules/sg-rules.component';
import { VirtualMachine } from '../shared/vm.model';
import { VmService } from '../shared/vm.service';
import { Color } from '../../shared/models/color.model';
import { ZoneService } from '../../shared/services/zone.service';
import { InstanceGroupService } from '../../shared/services/instance-group.service';
import { InstanceGroup } from '../../shared/models/instance-group.model';
import { ServiceOfferingFields } from '../../shared/models/service-offering.model';


@Component({
  selector: 'cs-vm-detail',
  templateUrl: 'vm-detail.component.html',
  styleUrls: ['vm-detail.component.scss']
})
export class VmDetailComponent implements OnChanges {
  @Input() public vm: VirtualMachine;
  public color: Color;
  public disableSecurityGroup = false;
  public expandNIC: boolean;
  public expandServiceOffering: boolean;
  public groupName: string;
  public groupNames: Array<string>;

  public ServiceOfferingFields = ServiceOfferingFields;

  constructor(
    private dialogService: MdlDialogService,
    private instanceGroupService: InstanceGroupService,
    private tagService: TagService,
    private translateService: TranslateService,
    private vmService: VmService,
    private zoneService: ZoneService
  ) {
    this.expandNIC = false;
    this.expandServiceOffering = false;
  }

  public ngOnChanges(): void {
    this.update();
  }

  public get doShowChangeGroupButton(): boolean {
    return this.groupName && (!this.vm.instanceGroup || this.vm.instanceGroup.name !== this.groupName);
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

  public isNotFormattedField(key: string): boolean {
    return [
      ServiceOfferingFields.id,
      ServiceOfferingFields.created,
      ServiceOfferingFields.diskBytesReadRate,
      ServiceOfferingFields.diskBytesWriteRate
    ].indexOf(key) === -1;
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

  public changeColor(color: Color): void {
    this.tagService.update(this.vm, 'UserVm', 'color', color.value)
      .subscribe(vm => {
        this.vm = vm;
        this.vmService.updateVmInfo(this.vm);
      });
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
    this.translateService.get('ARE_YOU_SURE_ADD_SECONDARY_IP')
      .switchMap(str => this.dialogService.confirm(str))
      .onErrorResumeNext()
      .subscribe(() => this.addSecondaryIp(vm));
  }

  public confirmRemoveSecondaryIp(secondaryIpId: string, vm: VirtualMachine): void {
    this.translateService.get('ARE_YOU_SURE_REMOVE_SECONDARY_IP')
      .switchMap(str => this.dialogService.confirm(str))
      .onErrorResumeNext()
      .subscribe(() => this.removeSecondaryIp(secondaryIpId, vm));
  }

  public changeServiceOffering(): void {
    this.dialogService.showCustomDialog({
      component: ServiceOfferingDialogComponent,
      classes: 'service-offering-dialog',
      providers: [{ provide: 'virtualMachine', useValue: this.vm }],
    });
  }

  private update(): void {
    this.updateColor();
    this.updateGroups();
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

  private checkSecurityGroupDisabled(): void {
    this.zoneService.get(this.vm.zoneId)
      .subscribe(zone => this.disableSecurityGroup = zone.networkTypeIsBasic);
  }
}
