import {
  Component,
  Input,
} from '@angular/core';
import {
  MatDialog,
  MatDialogConfig
} from '@angular/material';
import { isDefault, SecurityGroup } from '../../../../security-group/sg.model';
import { VirtualMachine } from '../../../shared/vm.model';
import { SgRulesContainerComponent } from '../../../../security-group/containers/sg-rules.container';


@Component({
  selector: 'cs-firewall-rules-detail',
  templateUrl: 'firewall-rules-detail.component.html'
})
export class FirewallRulesDetailComponent {
  @Input() public vm: VirtualMachine;
  @Input() public defaultGroupName: string;

  public get isDefault() {
    return isDefault;
  }

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
}
