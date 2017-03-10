import {
  Component,
  EventEmitter,
  OnInit,
  Output
} from '@angular/core';

import {
  InstanceGroup,
  InstanceGroupService,
  Zone,
  ZoneService
} from '../../shared';

import { SectionType } from '../vm-list/vm-list.component';


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
    private zoneService: ZoneService
  ) {}

  public ngOnInit(): void {
    this.instanceGroupService.getList().subscribe(groupList => this.groups = groupList);
    this.zoneService.getList().subscribe(zoneList => this.zones = zoneList);
  }

  public update(): void {
    this.updateFilters.emit({
      doFilterByColor: this.doFilterByColor,
      selectedGroups: this.selectedGroups,
      selectedZones: this.selectedZones,
      mode: this.mode
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
