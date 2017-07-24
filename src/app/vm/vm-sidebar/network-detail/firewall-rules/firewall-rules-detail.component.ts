import { Component, Input } from '@angular/core';
import { VirtualMachine } from '../../../shared/vm.model';
import { SgRulesComponent } from '../../../../security-group/sg-rules/sg-rules.component';
import { SecurityGroup } from '../../../../security-group/sg.model';
import { MdDialog } from '@angular/material';


@Component({
  selector: 'cs-firewall-rules-detail',
  templateUrl: 'firewall-rules-detail.component.html'
})
export class FirewallRulesDetailComponent {
  @Input() public vm: VirtualMachine;

  constructor(private dialog: MdDialog) {}

  public showRulesDialog(securityGroup: SecurityGroup): void {
    this.dialog.open(SgRulesComponent, {
      data: securityGroup,
      width: '880px'
    });
  }
}
