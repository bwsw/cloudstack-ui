import {
  Component,
  OnInit,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '../../../reducers';
import * as fromSshKeys from '../../redux/ssh-key.reducers';
import * as fromAccounts from '../../../reducers/accounts/redux/accounts.reducers';
import { FilterService } from '../../../shared/services/filter.service';
import * as accountAction from '../../../reducers/accounts/redux/accounts.actions';
import * as sshKeyActions from '../../redux/ssh-key.actions';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionStorageService } from '../../../shared/services/session-storage.service';
import { WithUnsubscribe } from '../../../utils/mixins/with-unsubscribe';
import { sshKeyGroupings } from '../ssh-key-page/ssh-key-page.container';
import { AuthService } from '../../../shared/services/auth.service';

export const sshKeyListFilters = 'sshKeyListFilters';

@Component({
  selector: 'cs-ssh-key-filter-container',
  templateUrl: 'ssh-key-filter.container.html'
})
export class ShhKeyFilterContainerComponent extends WithUnsubscribe() implements OnInit {

  private filters$ = this.store.select(fromSshKeys.filters);
  readonly accounts$ = this.store.select(fromAccounts.selectAll);
  readonly selectedGroupings$ = this.store.select(fromSshKeys.filterSelectedGroupings);
  readonly selectedAccountIds$ = this.store.select(fromSshKeys.filterSelectedAccountIds);


  private filtersKey = sshKeyListFilters;
  private filterService = new FilterService(
    {
      'accounts': { type: 'array', defaultOption: [] },
      'groupings': { type: 'array', defaultOption: [] }
    },
    this.router,
    this.sessionStorage,
    this.filtersKey,
    this.activatedRoute
  );

  constructor(
    private authService: AuthService,
    private store: Store<State>,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private sessionStorage: SessionStorageService
  ) {
    super();
  }

  public onGroupingsChange(selectedGroupings) {
    this.store.dispatch(new sshKeyActions.SshKeyFilterUpdate({ selectedGroupings }));
  }

  public onAccountsChange(selectedAccountIds) {
    this.store.dispatch(new sshKeyActions.SshKeyFilterUpdate({ selectedAccountIds }));
  }

  public ngOnInit(): void {
    this.store.dispatch(new accountAction.LoadAccountsRequest());
    this.initFilters();
  }

  private initFilters(): void {
    const params = this.filterService.getParams();
    const selectedGroupings = params['groupings'].reduce((acc, group) => {
      const grouping = sshKeyGroupings.find(g => {
        if (g.key === 'accounts' === group) {
          return this.authService.isAdmin();
        }
        return g.key === group;
      });
      if (grouping) {
        acc.push(grouping);
      }
      return acc;
    }, []);

    const selectedAccountIds = params['accounts'];

    this.store.dispatch(new sshKeyActions.SshKeyFilterUpdate({
      selectedAccountIds,
      selectedGroupings
    }));

    this.filters$
      .takeUntil(this.unsubscribe$)
      .subscribe(filters => this.filterService.update({
        'groupings': filters.selectedGroupings.map(g => g.key),
        'accounts': filters.selectedAccountIds
      }));
  }
}
