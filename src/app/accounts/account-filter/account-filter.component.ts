import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FilterComponent } from '../../shared/interfaces/filter-component';
import { FilterService } from '../../shared/services/filter.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from '../../shared/services/local-storage.service';

export interface AccountFilter {
  groupings: Array<any>;
}

export const accountListFilters = 'accountListFilters';

@Component({
  selector: 'cs-account-filter',
  templateUrl: 'account-filter.component.html'
})
export class AccountFilterComponent implements FilterComponent<AccountFilter> {
  @Input() public availableGroupings: Array<any>;
  @Output() public updateFilters: EventEmitter<AccountFilter>;

  private filtersKey = accountListFilters;
  public selectedGroupings: Array<any> = [];
  private filterService = new FilterService({
    groupings: { type: 'array', defaultOption: [] }
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

    this.selectedGroupings = params.groupings.reduce((acc, _) => {
      const grouping = this.availableGroupings.find(g => g.key === _);
      if (grouping) {
        acc.push(grouping);
      }
      return acc;
    }, []);

    this.update();
  }

  public update(): void {
    this.updateFilters.emit({
      groupings: this.selectedGroupings
    });

    this.filterService.update(this.filtersKey, {
      groupings: this.selectedGroupings.map(_ => _.key)
    });
  }
}
