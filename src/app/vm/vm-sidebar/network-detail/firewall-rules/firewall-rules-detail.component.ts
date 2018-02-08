import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import {
  MatDialog,
  MatDialogConfig
} from '@angular/material';
import { SecurityGroup } from '../../../../security-group/sg.model';
import { VirtualMachine } from '../../../shared/vm.model';
import { SgRulesContainerComponent } from '../../../../security-group/containers/sg-rules.container';
import { SgListContainerComponent } from '../../../container/sg-list.container';


@Component({
  selector: 'cs-firewall-rules-detail',
  templateUrl: 'firewall-rules-detail.component.html',
  styleUrls: ['firewall-rules-detail.component.scss']
})
export class FirewallRulesDetailComponent {
  @Input() public vm: VirtualMachine;
  @Output() public detachFirewall = new EventEmitter();
  @Output() public attachFirewall = new EventEmitter();

  constructor(
    private dialog: MatDialog
  ) { }

  public showRulesDialog(entity: SecurityGroup) {
    const vmId = this.vm.id;

    this.dialog.open(SgRulesContainerComponent, <MatDialogConfig>{
      width: '880px',
      data: { securityGroupId: entity.id, vmId }
    })
      .afterClosed();
  }

  public showAttachFirewallDialog() {
    this.dialog.open(SgListContainerComponent, <MatDialogConfig>{
      width: '880px',
      data: this.vm.securityGroup
    })
      .afterClosed()
      .subscribe((sg: Array<SecurityGroup>) => this.attachFirewall.emit(sg));
  }
}
