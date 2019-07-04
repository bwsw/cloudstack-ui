import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Account, Grouping, VolumeType, volumeTypeNames, Zone } from '../../shared/models';
import { AuthService } from '../../shared/services/auth.service';
import { reorderAvailableGroupings } from '../../shared/utils/reorder-groupings';

@Component({
  selector: 'cs-volume-filter',
  templateUrl: 'volume-filter.component.html',
})
export class VolumeFilterComponent implements OnInit, OnChanges {
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

  public accountsFiltered: Account[] = [];
  public accountQuery = '';

  constructor(private authService: AuthService) {}

  public ngOnInit() {
    this.groupings = reorderAvailableGroupings(this.groupings, this.selectedGroupings);
  }

  public ngOnChanges(changes: SimpleChanges) {
    const accounts = changes['accounts'];
    if (accounts) {
      this.onAccountQueryChanged(this.accountQuery);
    }
  }

  public getVolumeTypeName(type: VolumeType): string {
    return volumeTypeNames[type];
  }

  public showAccountFilter(): boolean {
    return this.authService.isAdmin();
  }

  public onAccountQueryChanged(accountQuery: string) {
    const queryLower = accountQuery && accountQuery.toLowerCase();
    this.accountsFiltered = this.accounts.filter(
      account => !accountQuery || account.name.toLowerCase().includes(queryLower),
    );
  }
}
