import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as sortBy from 'lodash/sortBy';
import { InstanceGroup, Zone } from '../../shared/models';
import { FilterService } from '../../shared/services/filter.service';
import { LocalStorageService } from '../../shared/services/local-storage.service';
import { VmState } from '../shared/vm.model';
import { VmService } from '../shared/vm.service';
import { InstanceGroupOrNoGroup, NoGroup, noGroup } from '../../shared/components/instance-group/no-group';
import { FilterComponent } from '../../shared/interfaces/filter-component';


export interface VmFilter {
  selectedGroups: Array<InstanceGroup | NoGroup>;
  selectedStates: Array<VmState>;
  selectedZones: Array<Zone>;
  groupings: Array<any>;
}

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
  public states = [
    { state: VmState.Running, name: 'VM_PAGE.FILTERS.STATE_RUNNING' },
    { state: VmState.Stopped, name: 'VM_PAGE.FILTERS.STATE_STOPPED' },
    { state: VmState.Error, name: 'VM_PAGE.FILTERS.STATE_ERROR' }
  ];
  public showNoGroupFilter = true;

  private filtersKey = 'vmListFilters';
  private filterService = new FilterService({
    zones: { type: 'array', defaultOption: [] },
    groups: { type: 'array', defaultOption: [] },
    groupings: { type: 'array', defaultOption: [] },
    states: { type: 'array', options: this.states.map(_ => _.state), defaultOption: [] }
  }, this.router, this.storage, this.filtersKey, this.activatedRoute);

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private vmService: VmService,
    private storage: LocalStorageService
  ) {}

  public ngOnInit(): void {
    this.vmService.instanceGroupUpdateObservable.subscribe(() => this.loadGroups());
  }

  public ngOnChanges(changes: SimpleChanges): void {
    const groups = changes['groups'];
    const zones = changes['zones'];
    if (groups.currentValue && zones.currentValue) {
      this.initFilters();
    }
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

  public update(): void {
    this.updateFilters.emit({
      selectedGroups: this.selectedGroups.sort(this.groupSortPredicate),
      selectedStates: this.selectedStates,
      selectedZones: sortBy(this.selectedZones, 'name'),
      groupings: this.selectedGroupings
    });

    this.filterService.update(this.filtersKey, {
      zones: this.selectedZones.map(_ => _.id),
      groups: this.selectedGroups.map(_ => (_ as InstanceGroup).name || ''),
      states: this.selectedStates,
      groupings: this.selectedGroupings.map(_ => _.key)
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
