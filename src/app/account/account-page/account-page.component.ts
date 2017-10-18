import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { ListService } from '../../shared/components/list/list.service';
import {
  Account,
  Domain,
  Role
} from '../../shared';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'cs-account-page',
  templateUrl: 'account-page.component.html',
  styleUrls: ['account-page.component.scss'],
  providers: [ListService]
})
export class AccountPageComponent {
  @Input() public accounts: Array<Account> = [];
  @Input() public domains: Array<Domain>;
  @Input() public roles: Array<Role>;
  @Input() public roleTypes: Array<string>;
  @Input() public states: Array<string>;
  @Input() public groupings: Array<any>;
  @Input() public isLoading: boolean;
  @Input() public selectedRoleTypes: string[] = [];
  @Input() public selectedDomainIds: string[] = [];
  @Input() public selectedRoleNames: string[] = [];
  @Input() public selectedStates: string[] = [];
  @Input() public selectedGroupings: Array<any> = [];

  @Output() public onDomainsChange = new EventEmitter();
  @Output() public onRolesChange = new EventEmitter();
  @Output() public onRoleTypesChange = new EventEmitter();
  @Output() public onStatesChange = new EventEmitter();
  @Output() public onAccountChanged = new EventEmitter<Account>();
  @Output() public onGroupingsChange = new EventEmitter();

  constructor(
    public listService: ListService,
    public authService: AuthService
  ) {}

  private updateList(account?: Account): void {
    this.onAccountChanged.emit(account);
    if (account && this.listService.isSelected(account.id)) {
      this.listService.deselectItem();
    }
  }

  public isAdmin() {
    return this.authService.isAdmin();
  }

}
