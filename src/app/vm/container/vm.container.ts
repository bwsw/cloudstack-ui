import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { State } from '../../reducers';
import { Store } from '@ngrx/store';
import * as fromVMs from '../../reducers/vm/redux/vm.reducers';
import * as fromVolumes from '../../reducers/volumes/redux/volumes.reducers';
import * as fromOsTypes from '../../reducers/templates/redux/ostype.reducers';
import * as vmActions from '../../reducers/vm/redux/vm.actions';
import * as volumeActions from '../../reducers/volumes/redux/volumes.actions';
import * as osTypesActions from '../../reducers/templates/redux/ostype.actions';
import * as securityGroupActions from '../../reducers/security-groups/redux/sg.actions';
import * as snapshotActions from '../../reducers/snapshots/redux/snapshot.actions';
import { AuthService } from '../../shared/services/auth.service';
import { VirtualMachine } from '../shared/vm.model';

import { noGroup } from '../vm-filter/vm-filter.component';
import { VmTagService } from '../../shared/services/tags/vm-tag.service';
import { Grouping } from '../../shared/models';

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
      [query]="query$ | async"
      [volumes]="volumes$ | async"
      [osTypesMap]="osTypesMap$ | async"
      [isLoading]="loading$ | async"
      [groupings]="groupings"
      [selectedGroupings]="selectedGroupings$ | async"
    ></cs-vm-page>`
})
export class VirtualMachinePageContainerComponent implements OnInit, AfterViewInit {

  readonly vms$ = this.store.select(fromVMs.selectFilteredVMs);
  readonly query$ = this.store.select(fromVMs.filterQuery);
  readonly volumes$ = this.store.select(fromVolumes.selectAll);
  readonly osTypesMap$ = this.store.select(fromOsTypes.selectEntities);
  readonly loading$ = this.store.select(fromVMs.isLoading);
  readonly selectedGroupings$ = this.store.select(fromVMs.filterSelectedGroupings);

  public groupings: Array<Grouping> = [
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
      key: 'accounts',
      label: 'VM_PAGE.FILTERS.GROUP_BY_ACCOUNTS',
      selector: (item: VirtualMachine) => item.account,
      name: (item: VirtualMachine) => getGroupName(item)
    },
    {
      key: 'colors',
      label: 'VM_PAGE.FILTERS.GROUP_BY_COLORS',
      selector: (item: VirtualMachine) => this.vmTagService.getColorSync(item).value,
      name: (item: VirtualMachine) => ''
    },
  ];

  constructor(
    private store: Store<State>,
    private authService: AuthService,
    private vmTagService: VmTagService,
    private cd: ChangeDetectorRef
  ) {
    if (!this.isAdmin()) {
      this.groupings = this.groupings.filter(g => g.key !== 'accounts');
    }
  }

  public ngOnInit() {
    this.store.dispatch(new vmActions.LoadVMsRequest());
    this.store.dispatch(new volumeActions.LoadVolumesRequest());
    this.store.dispatch(new snapshotActions.LoadSnapshotRequest());
    this.store.dispatch(new osTypesActions.LoadOsTypesRequest());
    this.store.dispatch(new securityGroupActions.LoadSecurityGroupRequest());
  }

  public isAdmin() {
    return this.authService.isAdmin();
  }

  public ngAfterViewInit() {
    this.cd.detectChanges();
  }
}
