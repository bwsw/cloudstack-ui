import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Account, Grouping, VolumeType, volumeTypeNames, Zone } from '../../shared/models';
import { AuthService } from '../../shared/services/auth.service';
import { reorderAvailableGroupings } from '../../shared/utils/reorder-groupings';

@Component({
  selector: 'cs-volume-filter',
  templateUrl: 'volume-filter.component.html'
})
export class VolumeFilterComponent implements OnInit {
  @Input() public zones: Array<Zone>;
  @Input() public types: Array<VolumeType>;
  @Input() public groupings: Array<Grouping>;
  @Input() public selectedGroupings: Array<Grouping>;
  @Input() public accounts: Array<Account>;
  @Input() public query: string;
  @Input() public spareOnly: boolean;
  @Input() public selectedZoneIds: Array<string>;
  @Input() public selectedTypes: Array<string>;
  @Input() public selectedAccountIds: Array<string>;
  @Output() public onQueryChange = new EventEmitter();
  @Output() public onSpareOnlyChange = new EventEmitter();
  @Output() public onZonesChange = new EventEmitter();
  @Output() public onAccountsChange = new EventEmitter();
  @Output() public onTypesChange = new EventEmitter();
  @Output() public onGroupingsChange = new EventEmitter();

  constructor(private authService: AuthService) {
  }

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
