import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Domain, Role } from '../../shared/models';
import { stateTranslations } from '../account-container/account.container';
import { reorderAvailableGroupings } from '../../shared/utils/reorder-groupings';

@Component({
  selector: 'cs-account-list-filter',
  templateUrl: 'account-list-filter.component.html',
})
export class AccountListFilterComponent implements OnInit {
  @Input()
  public domains: Domain[];
  @Input()
  public roleTypes: string[];
  @Input()
  public roles: Role[];
  @Input()
  public states: string[];
  @Input()
  public groupings: any[];
  @Input()
  public selectedRoleTypes: string[] = [];
  @Input()
  public selectedDomainIds: string[] = [];
  @Input()
  public selectedRoleNames: string[] = [];
  @Input()
  public selectedStates: string[] = [];
  @Input()
  public selectedGroupings: any[] = [];
  @Output()
  public domainsChanged = new EventEmitter();
  @Output()
  public rolesChanged = new EventEmitter();
  @Output()
  public roleTypesChanged = new EventEmitter();
  @Output()
  public statesChanged = new EventEmitter();
  @Output()
  public groupingsChanged = new EventEmitter();

  public stateTranslationToken(state): string {
    return stateTranslations[state];
  }

  public ngOnInit() {
    this.groupings = reorderAvailableGroupings(this.groupings, this.selectedGroupings);
  }
}
