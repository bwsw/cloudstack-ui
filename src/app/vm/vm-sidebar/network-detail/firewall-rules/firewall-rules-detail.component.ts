import { Component, Input } from '@angular/core';
import { MdDialog, MdDialogConfig } from '@angular/material';
import { SgRulesComponent } from '../../../../security-group/sg-rules/sg-rules.component';
import { SecurityGroup } from '../../../../security-group/sg.model';
import { VirtualMachine } from '../../../shared/vm.model';
import { SecurityGroupService } from '../../../../security-group/services/security-group.service';


@Component({
  selector: 'cs-firewall-rules-detail',
  templateUrl: 'firewall-rules-detail.component.html'
})
export class FirewallRulesDetailComponent {
  @Input() public vm: VirtualMachine;

  constructor(
    private dialog: MdDialog,
    private securityGroupService: SecurityGroupService
  ) {
  }

  public showRulesDialog(entity: SecurityGroup) {
    const fromVm = true;

    this.dialog.open(SgRulesComponent, <MdDialogConfig>{
      width: '880px',
      data: { entity, fromVm }
    })
      .afterClosed()
      .map(updatedGroup => {
        return this.securityGroupService.onSecurityGroupUpdate.next(updatedGroup);
      });
  }
}
