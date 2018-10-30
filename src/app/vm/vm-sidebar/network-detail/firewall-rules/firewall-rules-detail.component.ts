import { Component, Input } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { SecurityGroup } from '../../../../security-group/sg.model';
import { VirtualMachine } from '../../../shared/vm.model';
import { SgRulesContainerComponent } from '../../../../security-group/containers/sg-rules.container';

@Component({
  selector: 'cs-firewall-rules-detail',
  templateUrl: 'firewall-rules-detail.component.html',
})
export class FirewallRulesDetailComponent {
  @Input()
  public vm: VirtualMachine;

  constructor(private dialog: MatDialog) {}

  public showRulesDialog(entity: SecurityGroup) {
    const vmId = this.vm.id;

    this.dialog
      .open(SgRulesContainerComponent, {
        width: '880px',
        data: { vmId, securityGroupId: entity.id },
      } as MatDialogConfig)
      .afterClosed();
  }
}
