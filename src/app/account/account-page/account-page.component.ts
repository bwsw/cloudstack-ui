import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { ListService } from '../../shared/components/list/list.service';
import { Account } from '../../shared';
import { AuthService } from '../../shared/services/auth.service';
import {
  ActivatedRoute,
  Router
} from '@angular/router';

@Component({
  selector: 'cs-account-page',
  templateUrl: 'account-page.component.html',
  styleUrls: ['account-page.component.scss'],
  providers: [ListService]
})
export class AccountPageComponent {
  @Input() public accounts: Array<Account> = [];
  @Input() public groupings: Array<any>;
  @Input() public isLoading: boolean;
  @Input() public selectedGroupings: Array<any> = [];

  @Output() public onAccountChanged = new EventEmitter<Account>();

  constructor(
    public listService: ListService,
    public authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute
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

  public showCreationDialog(): void {
    this.router.navigate(['./create'], {
      queryParamsHandling: 'preserve',
      relativeTo: this.activatedRoute
    });
  }

}
