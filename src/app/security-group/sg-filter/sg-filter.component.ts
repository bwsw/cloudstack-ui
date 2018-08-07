import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { SecurityGroupViewMode } from '../sg-view-mode';

export interface SecurityGroupFilter {
  viewMode: SecurityGroupViewMode;
  query: string;
  selectedAccountIds: Array<string>;
  selectOrphanSG: boolean;
}


@Component({
  selector: 'cs-sg-filter',
  templateUrl: 'sg-filter.component.html',
  styleUrls: ['sg-filter.component.scss']
})
export class SgFilterComponent {
  @Input() public accounts: Array<Account>;
  @Input() public orphan: boolean;
  @Output() public viewModeChange = new EventEmitter<SecurityGroupViewMode>();
  @Output() public queryChange = new EventEmitter<string>();
  @Output() public vmChange = new EventEmitter<string>();
  @Output() public onAccountsChange = new EventEmitter<Array<string>>();
  @Output() public onOrphanChange = new EventEmitter<boolean>();

  public viewMode: SecurityGroupViewMode;
  public query: string;
  public selectedAccountIds: Array<string>;

  @Input()
  public set filters(filter: SecurityGroupFilter) {
    this.viewMode = filter.viewMode;
    this.query = filter.query;
    this.selectedAccountIds = filter.selectedAccountIds;
    this.orphan = filter.selectOrphanSG;
  }

  public get SecurityGroupViewMode() {
    return SecurityGroupViewMode;
  }
}
