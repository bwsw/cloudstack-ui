import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { DialogService } from '../../dialog/dialog-module/dialog.service';
import { SgRulesComponent } from '../../security-group/sg-rules/sg-rules.component';
import { SecurityGroup } from '../../security-group/sg.model';

import {
  ServiceOfferingDialogComponent
} from '../../service-offering/service-offering-dialog/service-offering-dialog.component';
import { Color, ServiceOffering, ServiceOfferingFields } from '../../shared/models';
import { ConfigService } from '../../shared/services';
import { ServiceOfferingService } from '../../shared/services/service-offering.service';
import { TagService } from '../../shared/services/tag.service';
import { ZoneService } from '../../shared/services/zone.service';
import { VirtualMachine } from '../shared/vm.model';
import { VmService } from '../shared/vm.service';


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

  constructor(
    private dialogService: DialogService,
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
    this.updateDescription();

    this.checkSecurityGroupDisabled();
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
