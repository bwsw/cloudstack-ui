import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Account, Grouping, VolumeType, volumeTypeNames, Zone } from '../../shared/models';
import { AuthService } from '../../shared/services/auth.service';
import { reorderAvailableGroupings } from '../../shared/utils/reorder-groupings';

@Component({
  selector: 'cs-volume-filter',
  templateUrl: 'volume-filter.component.html',
})
export class VolumeFilterComponent implements OnInit {
  @Input()
  public zones: Zone[];
  @Input()
  public types: VolumeType[];
  @Input()
  public groupings: Grouping[];
  @Input()
  public selectedGroupings: Grouping[];
  @Input()
  public accounts: Account[];
  @Input()
  public query: string;
  @Input()
  public spareOnly: boolean;
  @Input()
  public selectedZoneIds: string[];
  @Input()
  public selectedTypes: string[];
  @Input()
  public selectedAccountIds: string[];
  @Output()
  public queryChanged = new EventEmitter();
  @Output()
  public spareOnlyChanged = new EventEmitter();
  @Output()
  public zonesChanged = new EventEmitter();
  @Output()
  public accountsChanged = new EventEmitter();
  @Output()
  public typesChanged = new EventEmitter();
  @Output()
  public groupingsChanged = new EventEmitter();

  constructor(private authService: AuthService) {}

  public getVolumeTypeName(type: VolumeType): string {
    return volumeTypeNames[type];
  }

  public showAccountFilter(): boolean {
    return this.authService.isAdmin();
  }

  public ngOnInit() {
    this.groupings = reorderAvailableGroupings(this.groupings, this.selectedGroupings);
  }
}
