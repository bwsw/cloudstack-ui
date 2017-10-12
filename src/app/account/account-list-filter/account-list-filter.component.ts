import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { Role } from '../../shared/models/role.model';
import { Domain } from '../../shared/models/domain.model';
import { stateTranslations } from '../account-container/account.container';

@Component({
  selector: 'cs-account-list-filter',
  templateUrl: 'account-list-filter.component.html'
})
export class AccountListFilterComponent {
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
    return stateTranslations[state.toUpperCase()];
  }

}
