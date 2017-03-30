import {
  Component,
  EventEmitter,
  OnInit,
  Output
} from '@angular/core';

import { Zone, ZoneService } from '../../shared';

import { SectionType } from '../vm-list/vm-list.component';
import { VmService } from '../shared/vm.service';
import { InstanceGroup } from '../../shared/models/instance-group.model';
import { InstanceGroupService } from '../../shared/services/instance-group.service';
import { FilterService } from '../../shared/services/filter.service';
import { Observable } from 'rxjs';


export interface VmFilter {
  doFilterByColor: boolean;
  selectedGroups: Array<InstanceGroup>;
  selectedZones: Array<Zone>;
  mode: SectionType;
}

@Component({
  selector: 'cs-vm-filter',
  templateUrl: 'vm-filter.component.html',
  styleUrls: ['vm-filter.component.scss']
})
export class VmFilterComponent implements OnInit {
  @Output() public updateFilters = new EventEmitter<VmFilter>();
  public doFilterByColor = false;
  public selectedGroups: Array<InstanceGroup> = [];
  public selectedZones: Array<Zone> = [];
  public groups: Array<InstanceGroup>;
  public zones: Array<Zone>;
  public mode: SectionType = SectionType.zone;

  constructor(
    private instanceGroupService: InstanceGroupService,
    private vmService: VmService,
    private zoneService: ZoneService,
    private filter: FilterService
  ) { }

  public ngOnInit(): void {
    Observable.forkJoin(
      this.vmService.getInstanceGroupList(),
      this.zoneService.getList()
    ).subscribe(([groups, zones]) => {
      this.groups = groups;
      this.zones = zones;

      this.initFilters();
    });
    this.instanceGroupService.groupsUpdates.subscribe(() => this.loadGroups());
  }

  public initFilters(): void {
    const params = this.filter.init('vmListFilters', {
      'byColors': { type: 'boolean' },
      'mode': { type: 'string', options: ['zone', 'group'], defaultOption: 'zone' },
      'zones': { type: 'array', defaultOption: [] },
      'groups': { type: 'array', defaultOption: [] }
    });
    this.doFilterByColor = 'byColors' in params && params['byColors'] !== 'false';
    this.mode = params['mode'] === 'group' ? SectionType.group : SectionType.zone;
    this.selectedZones = this.zones.filter(zone => params['zones'].find(id => id === zone.id));
    this.selectedGroups = this.groups.filter(group => params['groups'].find(id => id === group.name));

    this.update();
  }

  public loadGroups(): void {
    this.vmService.getInstanceGroupList().subscribe(groupList => {
      this.groups = groupList;
      this.selectedGroups = this.selectedGroups.filter(selectedGroup => {
        return groupList.includes(selectedGroup);
      });
    });
  }

  public update(): void {
    this.updateFilters.emit({
      doFilterByColor: this.doFilterByColor,
      selectedGroups: this.selectedGroups,
      selectedZones: this.selectedZones,
      mode: this.mode
    });

    this.filter.update('vmListFilters', {
      'byColors': this.doFilterByColor,
      'mode': this.mode === SectionType.group ? 'group' : 'zone',
      'zones': this.selectedZones.length ? this.selectedZones.map(_ => _.id) : null,
      'groups': this.selectedGroups.length ? this.selectedGroups.map(_ => _.name) : null
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
}
