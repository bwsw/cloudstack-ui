import {
  Component,
  Input,
  OnInit
} from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '../../../../reducers/index';
import { VirtualMachine } from '../../../shared/vm.model';
import * as securityGroupActions from '../../../../reducers/security-groups/redux/sg.actions';


@Component({
  selector: 'cs-firewall-rules-detail-container',
  template: `
    <cs-firewall-rules-detail
      [vm]="vm"
    ></cs-firewall-rules-detail>`
})
export class FirewallRulesDetailContainerComponent implements OnInit {
  @Input() public vm: VirtualMachine;

  constructor(private store: Store<State>) {
  }

  public ngOnInit() {
    this.store.dispatch(new securityGroupActions.LoadSGRequest());
  }
}
