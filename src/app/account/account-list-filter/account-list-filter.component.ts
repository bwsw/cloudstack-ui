import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Domain, Role } from '../../shared/models';
import { stateTranslations } from '../account-container/account.container';
import { reorderAvailableGroupings } from '../../shared/utils/reorder-groupings';

@Component({
  selector: 'cs-account-list-filter',
  templateUrl: 'account-list-filter.component.html'
})
export class AccountListFilterComponent implements OnInit {
  @Input() public domains: Array<Domain>;
  @Input() public roleTypes: Array<string>;
  @Input() public roles: Array<Role>;
  @Input() public states: Array<string>;
  @Input() public groupings: Array<any>;
  @Input() public selectedRoleTypes: string[] = [];
  @Input() public selectedDomainIds: string[] = [];
  @Input() public selectedRoleNames: string[] = [];
  @Input() public selectedStates: string[] = [];
  @Input() public selectedGroupings: Array<any> = [];
  @Output() public onDomainsChange = new EventEmitter();
  @Output() public onRolesChange = new EventEmitter();
  @Output() public onRoleTypesChange = new EventEmitter();
  @Output() public onStatesChange = new EventEmitter();
  @Output() public onGroupingsChange = new EventEmitter();

  public stateTranslationToken(state): string {
    return stateTranslations[state];
  }

  public ngOnInit() {
    this.groupings = reorderAvailableGroupings(this.groupings, this.selectedGroupings);
  }
}
