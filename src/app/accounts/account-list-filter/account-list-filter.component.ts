import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FilterComponent } from '../../shared/interfaces/filter-component';
import { FilterService } from '../../shared/services/filter.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from '../../shared/services/local-storage.service';

export interface AccountFilter {
}

export const accountListFilters = 'accountListFilters';

@Component({
  selector: 'cs-account-list-filter',
  templateUrl: 'account-list-filter.component.html'
})
export class AccountListFilterComponent implements FilterComponent<AccountFilter> {
  @Input() public domains: Array<any>;
  @Input() public roles: Array<any>;
  @Output() public updateFilters: EventEmitter<AccountFilter>;

  private filtersKey = accountListFilters;
  public selectedGroupings: Array<any> = [];
  public selectedDomains: Array<any> = [];
  public selectedRoles: Array<any> = [];
  private filterService = new FilterService({
  }, this.router, this.localStorage, this.filtersKey, this.activatedRoute);

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private localStorage: LocalStorageService
  ) {
    this.updateFilters = new EventEmitter();
  }

  public initFilters(): void {
    const params = this.filterService.getParams();

    this.update();
  }

  public update(): void {
    this.updateFilters.emit({
    });

    this.filterService.update(this.filtersKey, {
    });
  }
}
