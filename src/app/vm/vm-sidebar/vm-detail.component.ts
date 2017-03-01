import {
  Component,
  Input,
  OnInit
} from '@angular/core';
import { MdlDialogService } from 'angular2-mdl';
import { SecurityGroup } from '../../security-group/sg.model';
import { ServiceOfferingDialogComponent } from '../../service-offering/service-offering-dialog.component';
import { SgRulesComponent } from '../../security-group/sg-rules/sg-rules.component';
import { VirtualMachine } from '../shared/vm.model';
import { ZoneService } from '../../shared/services/zone.service';


@Component({
  selector: 'cs-vm-detail',
  templateUrl: 'vm-detail.component.html',
  styleUrls: ['vm-detail.component.scss']
})
export class VmDetailComponent implements OnInit {
  @Input() public vm: VirtualMachine;
  public disableSecurityGroup = false;
  private expandNIC: boolean;
  private expandServiceOffering: boolean;

  constructor(
    private dialogService: MdlDialogService,
    private zoneService: ZoneService
  ) {
    this.expandNIC = false;
    this.expandServiceOffering = false;
  }

  public ngOnInit(): void {
    this.zoneService.get(this.vm.zoneId)
      .subscribe(zone => this.disableSecurityGroup = !zone.securityGroupsEnabled);
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

  public openConsole(): void {
    window.open(
      `/client/console?cmd=access&vm=${this.vm.id}`,
      this.vm.displayName,
      'resizable=0,width=820,height=640'
    );
  }

  public changeServiceOffering(): void {
    this.dialogService.showCustomDialog({
      component: ServiceOfferingDialogComponent,
      classes: 'service-offering-dialog',
      providers: [{ provide: 'virtualMachine', useValue: this.vm }],
    });
  }
}
