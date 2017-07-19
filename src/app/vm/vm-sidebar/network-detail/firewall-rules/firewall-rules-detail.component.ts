import { Component, Input } from '@angular/core';
import { VirtualMachine } from '../../../shared/vm.model';
import { DialogService } from '../../../../dialog/dialog-module/dialog.service';
import { SgRulesComponent } from '../../../../security-group/sg-rules/sg-rules.component';
import { SecurityGroup } from '../../../../security-group/sg.model';


@Component({
  selector: 'cs-firewall-rules-detail',
  templateUrl: 'firewall-rules-detail.component.html'
})
export class FirewallRulesDetailComponent {
  @Input() public vm: VirtualMachine;

  constructor(private dialogService: DialogService) {}

  public showRulesDialog(securityGroup: SecurityGroup): void {
    this.dialogService.showCustomDialog({
      component: SgRulesComponent,
      providers: [{ provide: 'securityGroup', useValue: securityGroup }],
      styles: { 'width': '880px' },
    });
  }
}
