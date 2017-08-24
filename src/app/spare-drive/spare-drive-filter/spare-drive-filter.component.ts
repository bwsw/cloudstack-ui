import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Zone } from '../../shared/models/zone.model';
import { FilterService } from '../../shared/services/filter.service';
import { LocalStorageService } from '../../shared/services/local-storage.service';
import * as sortBy from 'lodash/sortBy';


export interface SpareDriveFilter {
  spareOnly: boolean;
  selectedZones: Array<Zone>;
  groupings: Array<any>;
}

export const spareDriveListFilters = 'spareDriveListFilters';

@Component({
  selector: 'cs-spare-drive-filter',
  templateUrl: 'spare-drive-filter.component.html',
  styleUrls: ['spare-drive-filter.component.scss']
})
export class SpareDriveFilterComponent implements OnChanges {
  @Input() public zones: Array<Zone>;
  @Input() public groupings: Array<any>;
  @Output() public updateFilters: EventEmitter<SpareDriveFilter>;

  private filtersKey = 'vmListFilters';

  public spareOnly: boolean;
  public selectedZones: Array<Zone> = [];
  public selectedGroupingNames = [];

  private filterService = new FilterService({
    spareOnly: { type: 'boolean', defaultOption: false },
    zones: { type: 'array', defaultOption: [] },
    groupings: { type: 'array', defaultOption: [] }
  }, this.router, this.localStorage, spareDriveListFilters, this.activatedRoute);

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private localStorage: LocalStorageService
  ) {
    this.updateFilters = new EventEmitter();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['zones'].currentValue) {
      this.initFilters();
    }
  }

  public initFilters(): void {
    const params = this.filterService.getParams();

    this.selectedZones = this.zones.filter(zone =>
      params['zones'].find(id => id === zone.id)
    );

    this.selectedGroupingNames = params.groupings.reduce((acc, _) => {
      const grouping = this.groupings.find(g => g.key === _);
      if (grouping) {
        acc.push(grouping);
      }
      return acc;
    }, []);

    this.update();
  }

  public update(): void {
    this.updateFilters.emit({
      spareOnly: this.spareOnly,
      selectedZones: sortBy(this.selectedZones, 'name'),
      groupings: this.selectedGroupingNames
    });

    this.filterService.update(this.filtersKey, {
      spareOnly: this.spareOnly,
      zones: this.selectedZones.map(_ => _.id),
      groupings: this.selectedGroupingNames
    });
  }
}
