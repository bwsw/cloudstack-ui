import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Role } from '../../shared/models/role.model';
import { Domain } from '../../shared/models/domain.model';

const stateTranslations = {
  DISABLED: 'ACCOUNT_STATE.DISABLED',
  ENABLED: 'ACCOUNT_STATE.ENABLED',
  LOCKED: 'ACCOUNT_STATE.LOCKED',
}


@Component({
  selector: 'cs-account-list-filter',
  templateUrl: 'account-list-filter.component.html'
})
export class AccountListFilterComponent {
  @Input() public domains: Array<Domain>;
  @Input() public roleTypes: Array<string>;
  @Input() public roles: Array<Role>;
  @Input() public states: Array<string>;
  @Input() public selectedRoleTypes: string[] = [];
  @Input() public selectedDomainIds: string[] = [];
  @Input() public selectedRoleNames: string[] = [];
  @Input() public selectedStates: string[] = [];
  @Output() public onDomainsChange = new EventEmitter();
  @Output() public onRolesChange = new EventEmitter();
  @Output() public onRoleTypesChange = new EventEmitter();
  @Output() public onStatesChange = new EventEmitter();

  public stateTranslationToken(state): string {
    return stateTranslations[state.toUpperCase()];
  }

}
