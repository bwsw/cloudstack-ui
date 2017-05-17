import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Zone, ZoneService } from '../../shared';
import { InstanceGroup } from '../../shared/models';
import { FilterService, InstanceGroupService } from '../../shared/services';
import { VmState, VmStates } from '../shared/vm.model';
import { VmService } from '../shared/vm.service';

import { SectionType } from '../vm-list/vm-list.component';
import debounce = require('lodash/debounce');
import sortBy = require('lodash/sortBy');


export interface VmFilter {
  doFilterByColor: boolean;
  selectedGroups: Array<InstanceGroup | noGroup>;
  selectedStates: Array<VmState>;
  selectedZones: Array<Zone>;
  mode: SectionType;
}

export type noGroup = '-1';
export const noGroup: noGroup = '-1';
export type InstanceGroupOrNoGroup = InstanceGroup | noGroup;

@Component({
  selector: 'cs-vm-filter',
  templateUrl: 'vm-filter.component.html',
  styleUrls: ['vm-filter.component.scss']
})
export class VmFilterComponent implements OnInit {
  @Output() public updateFilters = new EventEmitter<VmFilter>();
  public doFilterByColor = false;
  public selectedGroups: Array<InstanceGroupOrNoGroup> = [];
  public selectedStates: Array<VmState> = [];
  public selectedZones: Array<Zone> = [];
  public groups: Array<InstanceGroup>;
  public zones: Array<Zone>;
  public states: Array<VmState> = [
    VmStates.Running,
    VmStates.Stopped,
    VmStates.Error
  ];
  public mode: SectionType = SectionType.zone;

  private filtersKey = 'vmListFilters';

  constructor(
    private instanceGroupService: InstanceGroupService,
    private vmService: VmService,
    private zoneService: ZoneService,
    private filter: FilterService
  ) {
    this.update = debounce(this.update, 300);
  }

  public ngOnInit(): void {
    Observable.forkJoin(
      this.vmService.getInstanceGroupList(),
      this.zoneService.getList()
    ).subscribe(([groups, zones]) => {
      this.groups = groups.sort(this.groupSortPredicate);
      this.zones = zones;

      this.initFilters();
    });
    this.instanceGroupService.groupsUpdates.subscribe(() => this.loadGroups());
  }

  public initFilters(): void {
    const params = this.filter.init(this.filtersKey, {
      'byColors': { type: 'boolean' },
      'mode': { type: 'string', options: ['zone', 'group'], defaultOption: 'zone' },
      'zones': { type: 'array', defaultOption: [] },
      'groups': { type: 'array', defaultOption: [] },
      'states': { type: 'array', options: this.states, defaultOption: [] }
    });
    this.doFilterByColor = !!params.byColors;
    this.mode = params['mode'] === 'group' ? SectionType.group : SectionType.zone;
    this.selectedZones = this.zones.filter(zone => params['zones'].find(id => id === zone.id));
    this.selectedGroups = this.groups.filter(group => params['groups'].find(name => name === group.name));
    this.selectedStates = params.states;

    const containsNoGroup = params['groups'].findIndex(group => group === '') !== -1;
    if (containsNoGroup) {
      this.selectedGroups.push(noGroup);
    }

    this.update();
  }

  public loadGroups(): void {
    this.vmService.getInstanceGroupList().subscribe(groupList => {
      this.groups = groupList.sort(this.groupSortPredicate);
      this.selectedGroups = this.selectedGroups.filter(selectedGroup => {
        return groupList.some(group => group.name === (selectedGroup as InstanceGroup).name);
      });
    });
  }

  public update(): void {
    this.updateFilters.emit({
      doFilterByColor: this.doFilterByColor,
      selectedGroups: this.selectedGroups.sort(this.groupSortPredicate),
      selectedStates: this.selectedStates,
      selectedZones: sortBy(this.selectedZones, 'name'),
      mode: this.mode
    });

    this.filter.update(this.filtersKey, {
      'byColors': this.doFilterByColor,
      'mode': this.mode === SectionType.group ? 'group' : 'zone',
      'zones': this.selectedZones.map(_ => _.id),
      'groups': this.selectedGroups.map(_ => (_ as InstanceGroup).name || ''),
      'states': this.selectedStates
    });
  }

  public updateColor(doFilterByColor: boolean): void {
    this.doFilterByColor = doFilterByColor;
    this.update();
  }

  public updateGroups(selectedGroups: Array<InstanceGroup>): void {
    this.selectedGroups = selectedGroups;
    this.update();
  }

  public updateStates(statuses: Array<VmState>): void {
    this.selectedStates = statuses;
    this.update();
  }

  public updateZones(selectedZones: Array<Zone>): void {
    this.selectedZones = selectedZones;
    this.update();
  }

  public changeMode(): void {
    if (this.mode === SectionType.group) {
      this.mode = SectionType.zone;
    } else {
      this.mode = SectionType.group;
    }
    this.update();
  }

  private groupSortPredicate(a: InstanceGroupOrNoGroup, b: InstanceGroupOrNoGroup): number {
    if (a === noGroup || a.name < (b as InstanceGroup).name) {
      return -1;
    }
    if (b === noGroup || a.name > b.name) {
      return 1;
    }
    return 0;
  }
}
