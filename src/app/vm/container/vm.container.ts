import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';
import { State } from '../../reducers/index';
import { Store } from '@ngrx/store';
import * as fromVMs from '../../reducers/vm/redux/vm.reducers';
import * as vmActions from '../../reducers/vm/redux/vm.actions';
import { AuthService } from '../../shared/services/auth.service';
import { VirtualMachine } from '../shared/vm.model';

import { noGroup } from '../vm-filter/vm-filter.component';
import { VmTagService } from '../../shared/services/tags/vm-tag.service';

const getGroupName = (vm: VirtualMachine) => {
  return vm.domain !== 'ROOT'
    ? `${vm.domain}/${vm.account}`
    : vm.account;
};


@Component({
  selector: 'cs-vm-page-container',
  template: `
    <cs-vm-page
      [vms]="vms$ | async"
      [isLoading]="loading$ | async"
      [groupings]="groupings"
      [selectedGroupings]="selectedGroupings$ | async"
    ></cs-vm-page>`
})
export class VirtualMachinePageContainerComponent implements OnInit, AfterViewInit {

  readonly vms$ = this.store.select(fromVMs.selectFilteredVMs);
  readonly loading$ = this.store.select(fromVMs.isLoading);
  readonly selectedGroupings$ = this.store.select(fromVMs.filterSelectedGroupings);

  public groupings = [
    {
      key: 'zones',
      label: 'VM_PAGE.FILTERS.GROUP_BY_ZONES',
      selector: (item: VirtualMachine) => item.zoneId,
      name: (item: VirtualMachine) => item.zoneName
    },
    {
      key: 'groups',
      label: 'VM_PAGE.FILTERS.GROUP_BY_GROUPS',
      selector: (item: VirtualMachine) =>
        item.instanceGroup ? item.instanceGroup.name : noGroup,
      name: (item: VirtualMachine) =>
        item.instanceGroup ? item.instanceGroup.name : 'VM_PAGE.FILTERS.NO_GROUP'
    },
    {
      key: 'colors',
      label: 'VM_PAGE.FILTERS.GROUP_BY_COLORS',
      selector: (item: VirtualMachine) => this.vmTagService.getColorSync(item).value,
      name: (item: VirtualMachine) => ' ',
    },
    {
      key: 'accounts',
      label: 'VM_PAGE.FILTERS.GROUP_BY_ACCOUNTS',
      selector: (item: VirtualMachine) => item.account,
      name: (item: VirtualMachine) => getGroupName(item),
    }
  ];

  public ngOnInit() {
    this.store.dispatch(new vmActions.LoadVMsRequest());
  }

  constructor(
    private store: Store<State>,
    private authService: AuthService,
    private vmTagService: VmTagService,
    private cd: ChangeDetectorRef
  ) {
    if (!this.isAdmin()) {
      this.groupings = this.groupings.filter(g => g.key != 'accounts');
    }
  }

  public isAdmin() {
    return this.authService.isAdmin();
  }

  public ngAfterViewInit() {
    this.cd.detectChanges();
  }
}
