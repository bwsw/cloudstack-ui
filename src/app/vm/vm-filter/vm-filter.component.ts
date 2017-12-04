import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import {
  InstanceGroup,
  Zone
} from '../../shared/models';
import { VmState } from '../shared/vm.model';
import { Account } from '../../shared/models/account.model';

export interface VmFilter {
  selectedGroups: Array<InstanceGroup | noGroup>;
  selectedStates: Array<VmState>;
  selectedZones: Array<Zone>;
  groupings: Array<any>;
  accounts: Array<Account>;
}

export type noGroup = '-1';
export const noGroup: noGroup = '-1';
export type InstanceGroupOrNoGroup = InstanceGroup | noGroup;

@Component({
  selector: 'cs-vm-filter',
  templateUrl: 'vm-filter.component.html'
})
export class VmFilterComponent {
  @Input() public selectedGroupings: Array<any>;
  @Input() public groupings: Array<any>;
  @Input() public groups: Array<any>;
  @Input() public states: Array<any>;
  @Input() public zones: Array<Zone>;
  @Input() public query: string;
  @Input() public accounts: Array<Account>;
  @Input() public selectedZoneIds: Array<string>;
  @Input() public selectedGroupNames: Array<string>;
  @Input() public selectedAccountIds: Array<string>;
  @Input() public selectedStates: Array<any>;
  @Output() public onQueryChange = new EventEmitter();
  @Output() public onGroupingsChange = new EventEmitter();
  @Output() public onZonesChange = new EventEmitter();
  @Output() public onGroupNamesChange = new EventEmitter();
  @Output() public onAccountsChange = new EventEmitter();
  @Output() public onStatesChange = new EventEmitter();

  public noGroup = noGroup;
}
