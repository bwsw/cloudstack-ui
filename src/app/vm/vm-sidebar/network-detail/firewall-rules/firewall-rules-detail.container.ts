import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '../../../../reducers/index';
import { VirtualMachine } from '../../../shared/vm.model';

@Component({
  selector: 'cs-firewall-rules-detail-container',
  template: `
    <cs-firewall-rules-detail
      [vm]="vm"
    ></cs-firewall-rules-detail>`
})
export class FirewallRulesDetailContainerComponent {
  @Input() public vm: VirtualMachine;

  constructor(private store: Store<State>) {
  }
}
