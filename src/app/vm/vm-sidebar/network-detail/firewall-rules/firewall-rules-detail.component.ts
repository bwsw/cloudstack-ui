import {
  Component,
  Input,
  OnInit
} from '@angular/core';
import {
  MatDialog,
  MatDialogConfig
} from '@angular/material';
import { State } from '../../../../reducers/index';
import { Store } from '@ngrx/store';
import { SecurityGroup } from '../../../../security-group/sg.model';
import { VirtualMachine } from '../../../shared/vm.model';
import { SgRulesContainerComponent } from '../../../../security-group/containers/sg-rules.container';
import * as securityGroupActions from '../../../../reducers/security-groups/redux/sg.actions';


@Component({
  selector: 'cs-firewall-rules-detail',
  templateUrl: 'firewall-rules-detail.component.html'
})
export class FirewallRulesDetailComponent implements OnInit {
  @Input() public vm: VirtualMachine;

  constructor(
    private dialog: MatDialog,
    private store: Store<State>
  ) {
  }

  public ngOnInit() {
    this.store.dispatch(new securityGroupActions.LoadSGRequest());
  }

  public showRulesDialog(entity: SecurityGroup) {
    const vmId = this.vm.id;

    this.dialog.open(SgRulesContainerComponent, <MatDialogConfig>{
      width: '880px',
      data: { id: entity.id, vmId }
    })
      .afterClosed();
  }
}
