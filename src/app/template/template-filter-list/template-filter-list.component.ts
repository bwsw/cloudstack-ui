import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { OsType } from '../../shared/models/os-type.model';
import { Zone } from '../../shared/models/zone.model';
import { AuthService } from '../../shared/services/auth.service';
import { Iso } from '../shared/iso.model';
import { Template } from '../shared/template.model';
import { Account } from '../../shared/models/account.model';
import { Domain } from '../../shared/models/domain.model';

@Component({
  selector: 'cs-template-filter-list',
  templateUrl: 'template-filter-list.component.html',
  styleUrls: ['template-filter-list.component.scss']
})
export class TemplateFilterListComponent implements OnInit {
  @Input() public templates: Array<Template | Iso>;
  @Input() public fetching = false;

  @Input() public showDelimiter = true;
  @Input() public viewMode: string;
  @Input() public groupings: object[];
  @Input() public accounts: Account[];
  @Input() public domains: Domain[];
  @Input() public zoneId: string;
  @Input() public osTypes: OsType[];
  @Input() public zones: Array<Zone>;

  @Input() public selectedAccountIds: string;
  @Input() public selectedGroupings: any[];
  @Input() public selectedTypes: any[];
  @Input() public selectedZones: any[];
  @Input() public selectedOsFamilies: any[];
  @Input() public query: string;

  @Output() public deleteTemplate = new EventEmitter();
  @Output() public viewModeChange = new EventEmitter();
  @Output() public onQueryChange = new EventEmitter();
  @Output() public onSelectedAccountsChange = new EventEmitter();
  @Output() public onSelectedGroupingsChange = new EventEmitter();
  @Output() public onSelectedTypesChange = new EventEmitter();
  @Output() public onSelectedOsFamiliesChange = new EventEmitter();
  @Output() public onSelectedZonesChange = new EventEmitter();

  @Output() public onTemplateDelete = new EventEmitter();


  constructor(protected authService: AuthService) {
  }

  public ngOnInit() {
    if (!this.authService.isAdmin()) {
      this.groupings = this.groupings.filter((g: any) => g.key !== 'accounts');
      this.accounts = [];
    } else {
    }
  }

  public changeViewMode(mode: string): void {
    this.viewMode = mode;
    this.viewModeChange.emit(this.viewMode);
  }
}
