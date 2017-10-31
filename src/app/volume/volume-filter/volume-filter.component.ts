import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import {
  VolumeType,
  volumeTypeNames
} from '../../shared/models/volume.model';
import { Zone } from '../../shared/models/zone.model';
import { Account } from '../../shared/models/account.model';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'cs-volume-filter',
  templateUrl: 'volume-filter.component.html',
  styleUrls: ['volume-filter.component.scss']
})
export class VolumeFilterComponent {
  @Input() public zones: Array<Zone>;
  @Input() public types: Array<VolumeType>;
  @Input() public groupings: Array<any>;
  @Input() public selectedGroupings: Array<any>;
  @Input() public accounts: Array<Account>;
  @Input() public searchPanelWhite: boolean;
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

  constructor(
    private authService: AuthService
  ) { }

  public getVolumeTypeName(type: VolumeType): string {
    return volumeTypeNames[type];
  }

  public showAccountFilter(): boolean {
    return this.authService.isAdmin();
  }

}
