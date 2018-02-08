import {
  Component,
  Input,
  OnInit
} from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '../../../../reducers/index';
import { VirtualMachine } from '../../../shared/vm.model';
import { SecurityGroup } from '../../../../security-group/sg.model';

import * as securityGroupActions from '../../../../reducers/security-groups/redux/sg.actions';
import * as vmActions from '../../../../reducers/vm/redux/vm.actions';


@Component({
  selector: 'cs-firewall-rules-detail-container',
  template: `
    <cs-firewall-rules-detail
      [vm]="vm"
      (detachFirewall)="detachFirewall($event)"
      (attachFirewall)="attachFirewall($event)"
    ></cs-firewall-rules-detail>`
})
export class FirewallRulesDetailContainerComponent implements OnInit {
  @Input() public vm: VirtualMachine;

  constructor(private store: Store<State>) {
  }

  public ngOnInit() {
    this.store.dispatch(new securityGroupActions.LoadSecurityGroupRequest());
  }

  public detachFirewall(securityGroupId: string) {
    const newSG = [...this.vm.securityGroup];
    const index = newSG.findIndex(_ => _.id === securityGroupId);
    newSG.splice(index);
    this.store.dispatch(new vmActions.UpdateVM(Object.assign({}, this.vm, {securityGroup: newSG})))
  }

  public attachFirewall(securityGroups: Array<SecurityGroup>) {
    this.store.dispatch(new vmActions.UpdateVM(Object.assign({}, this.vm, {securityGroup: securityGroups})))
  }
}
