import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { State } from '../../reducers';
import { select, Store } from '@ngrx/store';
import * as fromVMs from '../../reducers/vm/redux/vm.reducers';
import * as fromVolumes from '../../reducers/volumes/redux/volumes.reducers';
import * as fromOsTypes from '../../reducers/templates/redux/ostype.reducers';
import * as vmActions from '../../reducers/vm/redux/vm.actions';
import * as volumeActions from '../../reducers/volumes/redux/volumes.actions';
import * as osTypesActions from '../../reducers/templates/redux/ostype.actions';
import * as securityGroupActions from '../../reducers/security-groups/redux/sg.actions';
import * as snapshotActions from '../../reducers/snapshots/redux/snapshot.actions';
import { AuthService } from '../../shared/services/auth.service';
import { getInstanceGroupName, VirtualMachine } from '../shared/vm.model';

import { noGroup } from '../vm-filter/vm-filter.component';
import { VmTagService } from '../../shared/services/tags/vm-tag.service';
import { Grouping } from '../../shared/models';

const getGroupName = (vm: VirtualMachine) => {
  return vm.domain !== 'ROOT' ? `${vm.domain}/${vm.account}` : vm.account;
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
    ></cs-vm-page>`,
})
export class VirtualMachinePageContainerComponent implements OnInit, AfterViewInit {
  readonly vms$ = this.store.pipe(select(fromVMs.selectFilteredVMs));
  readonly query$ = this.store.pipe(select(fromVMs.filterQuery));
  readonly volumes$ = this.store.pipe(select(fromVolumes.selectAll));
  readonly osTypesMap$ = this.store.pipe(select(fromOsTypes.selectEntities));
  readonly loading$ = this.store.pipe(select(fromVMs.isLoading));
  readonly selectedGroupings$ = this.store.pipe(select(fromVMs.filterSelectedGroupings));

  public groupings: Grouping[] = [
    {
      key: 'zones',
      label: 'VM_PAGE.FILTERS.GROUP_BY_ZONES',
      selector: (item: VirtualMachine) => item.zoneid,
      name: (item: VirtualMachine) => item.zonename,
    },
    {
      key: 'groups',
      label: 'VM_PAGE.FILTERS.GROUP_BY_GROUPS',
      selector: (item: VirtualMachine) => getInstanceGroupName(item) || noGroup,
      name: (item: VirtualMachine) => getInstanceGroupName(item) || 'VM_PAGE.FILTERS.NO_GROUP',
    },
    {
      key: 'accounts',
      label: 'VM_PAGE.FILTERS.GROUP_BY_ACCOUNTS',
      selector: (item: VirtualMachine) => item.account,
      name: getGroupName,
    },
    {
      key: 'colors',
      label: 'VM_PAGE.FILTERS.GROUP_BY_COLORS',
      selector: (item: VirtualMachine) => this.vmTagService.getColorSync(item).value,
      name: (item: VirtualMachine) => '',
    },
  ];

  constructor(
    private store: Store<State>,
    private authService: AuthService,
    private vmTagService: VmTagService,
    private cd: ChangeDetectorRef,
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
