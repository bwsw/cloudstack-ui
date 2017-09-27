import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as sortBy from 'lodash/sortBy';
import { InstanceGroup, Zone } from '../../shared/models';
import { FilterService } from '../../shared/services/filter.service';
import { InstanceGroupService } from '../../shared/services/instance-group.service';
import { LocalStorageService } from '../../shared/services/local-storage.service';
import { VmState } from '../shared/vm.model';
import { VmService } from '../shared/vm.service';
import { FilterComponent } from '../../shared/interfaces/filter-component';
import { AuthService } from '../../shared/services/auth.service';
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
export class VmFilterComponent implements FilterComponent<VmFilter>, OnInit, OnChanges {
  @Input() public availableGroupings: Array<any>;
  @Input() public groups: Array<InstanceGroup>;
  @Input() public zones: Array<Zone>;
  @Output() public updateFilters = new EventEmitter<VmFilter>();

  public noGroup = noGroup;

  public selectedGroups: Array<InstanceGroupOrNoGroup> = [];
  public selectedStates: Array<VmState> = [];
  public selectedZones: Array<Zone> = [];
  public selectedGroupings: Array<any> = [];
  public selectedAccounts: Array<Account> = [];
  public selectedAccountIds: Array<string> = [];
  public states = [
    {
      state: VmState.Running,
      name: 'VM_PAGE.FILTERS.STATE_RUNNING'
    },
    {
      state: VmState.Stopped,
      name: 'VM_PAGE.FILTERS.STATE_STOPPED'
    },
    {
      state: VmState.Destroyed,
      name: 'VM_PAGE.FILTERS.STATE_DESTROYED',
      access: this.authService.allowedToViewDestroyedVms()
    },
    {
      state: VmState.Error,
      name: 'VM_PAGE.FILTERS.STATE_ERROR'
    }
  ].filter(state => !state.hasOwnProperty('access') || state['access']);
  public showNoGroupFilter = true;

  private filtersKey = 'vmListFilters';
  private filterService = new FilterService({
    zones: { type: 'array', defaultOption: [] },
    groups: { type: 'array', defaultOption: [] },
    groupings: { type: 'array', defaultOption: [] },
    states: { type: 'array', options: this.states.map(_ => _.state), defaultOption: [] },
    accounts: {type: 'array', defaultOption: [] }
  }, this.router, this.storage, this.filtersKey, this.activatedRoute);

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private instanceGroupService: InstanceGroupService,
    private vmService: VmService,
    private authService: AuthService,
    private storage: LocalStorageService
  ) {
  }

  public ngOnInit(): void {
    this.instanceGroupService.groupsUpdates.subscribe(() => this.loadGroups());
  }

  public ngOnChanges(changes: SimpleChanges): void {
    const groupsChange = changes['groups'];
    const zonesChange = changes['zones'];
    if (groupsChange && zonesChange) {
      if (groupsChange.currentValue && zonesChange.currentValue) {
        this.initFilters();
      }
    }
  }

  public showAccountFilter(): boolean {
    return this.authService.isAdmin();
  }

  public initFilters(): void {
    const params = this.filterService.getParams();
    this.selectedZones = this.zones.filter(zone =>
      params['zones'].find(id => id === zone.id)
    );
    this.selectedGroups = this.groups.filter(group =>
      params['groups'].find(name => name === group.name)
    );
    this.selectedStates = params.states;
    this.selectedGroupings = params.groupings.reduce((acc, _) => {
      const grouping = this.availableGroupings.find(g => g.key === _);
      if (grouping) {
        acc.push(grouping);
      }
      return acc;
    }, []);

    const sg = this.selectedGroupings;
    this.availableGroupings.sort((groupingA, groupingB) => {
      return sg.findIndex(_ => _ === groupingA) - sg.findIndex(_ => _ === groupingB);
    });

    const containsNoGroup = params['groups'].includes('');
    if (containsNoGroup) {
      this.selectedGroups.push(noGroup);
    }
    this.selectedAccountIds = params['accounts'];
    this.update();
  }

  public loadGroups(): void {
    this.vmService.getInstanceGroupList().subscribe(groupList => {
      this.groups = groupList.sort(this.groupSortPredicate);
      this.selectedGroups = this.selectedGroups.filter(selectedGroup => {
        return groupList.some(
          group => group.name === (selectedGroup as InstanceGroup).name);
      });
    });
  }

  public updateAccount(users: Array<Account>) {
    this.selectedAccounts = users;
    this.update();
  }

  public update(): void {
    this.updateFilters.emit({
      selectedGroups: this.selectedGroups.sort(this.groupSortPredicate),
      selectedStates: this.selectedStates,
      selectedZones: sortBy(this.selectedZones, 'name'),
      groupings: this.selectedGroupings,
      accounts: this.selectedAccounts
    });

    this.filterService.update(this.filtersKey, {
      zones: this.selectedZones.map(_ => _.id),
      groups: this.selectedGroups.map(_ => (_ as InstanceGroup).name || ''),
      states: this.selectedStates,
      groupings: this.selectedGroupings.map(_ => _.key),
      accounts: this.selectedAccounts.map(_ => _.id)
    });
  }

  private groupSortPredicate(
    a: InstanceGroupOrNoGroup,
    b: InstanceGroupOrNoGroup
  ): number {
    if (a === noGroup || a.name < (b as InstanceGroup).name) {
      return -1;
    }
    if (b === noGroup || a.name > b.name) {
      return 1;
    }
    return 0;
  }
}
