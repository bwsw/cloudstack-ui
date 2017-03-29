import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges
} from '@angular/core';

import { MdlDialogService } from 'angular2-mdl';

import {
  Tag,
  TagService
} from '../../shared';

import { SecurityGroup } from '../../security-group/sg.model';
import {
  ServiceOfferingDialogComponent
} from '../../service-offering/service-offering-dialog/service-offering-dialog.component';
import { SgRulesComponent } from '../../security-group/sg-rules/sg-rules.component';
import { VirtualMachine } from '../shared/vm.model';
import { VmService } from '../shared/vm.service';
import { Color } from '../../shared/models/color.model';
import { ZoneService } from '../../shared/services/zone.service';
import { ServiceOfferingFields } from '../../shared/models/service-offering.model';


@Component({
  selector: 'cs-vm-detail',
  templateUrl: 'vm-detail.component.html',
  styleUrls: ['vm-detail.component.scss']
})
export class VmDetailComponent implements OnInit, OnChanges {
  @Input() public vm: VirtualMachine;
  public color: Color;
  public disableSecurityGroup = false;

  public ServiceOfferingFields = ServiceOfferingFields;

  private expandNIC: boolean;
  private expandServiceOffering: boolean;

  constructor(
    private dialogService: MdlDialogService,
    private tagService: TagService,
    private vmService: VmService,
    private zoneService: ZoneService
  ) {
    this.expandNIC = false;
    this.expandServiceOffering = false;
  }

  public ngOnChanges(changes: SimpleChanges): void {
    this.updateColor();

    if ('vm' in changes) {
      this.checkSecurityGroupDisabled();
    }
  }

  public ngOnInit(): void {
    this.updateColor();
    this.checkSecurityGroupDisabled();
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
    let oldTag = this.vm.tags.find(tag => tag.key === 'color');

    let createObs = this.tagService.create({
      resourceIds: this.vm.id,
      resourceType: 'UserVm',
      'tags[0].key': 'color',
      'tags[0].value': color.value,
    })
      .map(() => {
        this.vm.tags.push(new Tag({
          resourceId: this.vm.id,
          resourceType: 'UserVm',
          key: 'color',
          value: color.value
        }));
        this.vmService.updateVmInfo(this.vm);
      });

    if (!oldTag) {
      createObs.subscribe();
      return;
    }
    this.tagService.remove({
      resourceIds: this.vm.id,
      resourceType: 'UserVm',
      'tags[0].key': 'color',
      'tags[0].value': oldTag.value || ''
    })
      .map(() => {
        this.vm.tags = this.vm.tags.filter(tag => tag.key !== oldTag.key);
      })
      .switchMap(() => createObs)
      .subscribe();
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

  public changeServiceOffering(): void {
    this.dialogService.showCustomDialog({
      component: ServiceOfferingDialogComponent,
      classes: 'service-offering-dialog',
      providers: [{ provide: 'virtualMachine', useValue: this.vm }],
    });
  }

  private updateColor(): void {
    this.color = this.vmService.getColor(this.vm);
  }

  private checkSecurityGroupDisabled(): void {
    this.zoneService.get(this.vm.zoneId)
      .subscribe(zone => this.disableSecurityGroup = zone.networkTypeIsBasic);
  }
}
