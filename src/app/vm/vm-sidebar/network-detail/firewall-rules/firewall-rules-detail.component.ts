import { Component, Input } from '@angular/core';
import { MdDialog } from '@angular/material';
import { Router } from '@angular/router';
import { SgRulesComponent } from '../../../../security-group/sg-rules/sg-rules.component';
import { SecurityGroup, SecurityGroupType } from '../../../../security-group/sg.model';
import { VirtualMachine } from '../../../shared/vm.model';


@Component({
  selector: 'cs-firewall-rules-detail',
  templateUrl: 'firewall-rules-detail.component.html'
})
export class FirewallRulesDetailComponent {
  @Input() public vm: VirtualMachine;

  constructor(
    private dialog: MdDialog,
    private router: Router
  ) {}

  public onEdit(securityGroup: SecurityGroup): void {
    if (securityGroup.type === SecurityGroupType.Shared) {
      this.onSharedGroupEdit(securityGroup);
    }

    if (securityGroup.type === SecurityGroupType.Private) {
      this.onPrivateGroupEdit(securityGroup);
    }
  }

  private onSharedGroupEdit(securityGroup: SecurityGroup): void {
    this.router.navigate(
      ['/security-group'],
      {
        queryParams: {
          viewMode: 'shared'
        }
      })
      .then(() => this.showRulesDialog(securityGroup));
  }

  private onPrivateGroupEdit(securityGroup: SecurityGroup): void {
    this.showRulesDialog(securityGroup);
  }

  private showRulesDialog(securityGroup: SecurityGroup): void {
    this.dialog.open(SgRulesComponent, {
      data: { securityGroup },
      width: '880px'
    });
  }
}
