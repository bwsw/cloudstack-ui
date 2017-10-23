import {
  Component,
  OnInit
} from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '../../reducers/index';
import { SessionStorageService } from '../../shared/services/session-storage.service';
import {
  ActivatedRoute,
  Router
} from '@angular/router';
import { WithUnsubscribe } from '../../utils/mixins/with-unsubscribe';
import { FilterService } from '../../shared/services/filter.service';
import { SSHKeyPair } from '../../shared/models/ssh-keypair.model';

import * as fromSshKeys from '../redux/ssh-key.reducers';
import * as sshKeyActions from '../redux/ssh-key.actions';

export const sshKeyListFilters = 'sshKeyListFilters';

@Component({
  selector: 'cs-ssh-key-page-container',
  templateUrl: 'ssh-key-list.container.html'
})
export class SshKeyListContainerComponent extends WithUnsubscribe() implements OnInit {
  readonly sshKeyList$ = this.store.select(fromSshKeys.selectFilteredSshKeys);
  readonly filters$ = this.store.select(fromSshKeys.filters);
  readonly selectedGroupings$ = this.store.select(fromSshKeys.filterSelectedGroupings);
  readonly selectedAccounts$ = this.store.select(fromSshKeys.filterSelectedAccounts);

  public groupings = [
    {
      key: 'accounts',
      label: 'SSH_KEYS.FILTERS.GROUP_BY_ACCOUNTS',
      selector: (item: SSHKeyPair) => item.account,
      name: (item: SSHKeyPair) => this.getGroupName(item)
    }
  ];

  public selectedGroupings = [];
  public selectedAccounts = [];

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
    private store: Store<State>,
    private sessionStorage: SessionStorageService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    super();
  }

  public ngOnInit(): void {
    this.initFilters();
    this.filters$
      .takeUntil(this.unsubscribe$)
      .subscribe(filters =>
        this.filterService.update({
          'groupings': filters.selectedGroupings.map(g => g.key),
          'accounts': filters.selectedAccounts.map(a => a.id)
        }));
  }

  public removeSshKeyPair(sshKeyPair: SSHKeyPair) {
    this.store.dispatch(new sshKeyActions.RemoveSshKeyPair(sshKeyPair));
  }

  public update(selectedGroupings) {
    this.store.dispatch(new sshKeyActions.SshKeyFilterUpdate({ selectedGroupings }));
  }

  public onAccountsChange(selectedAccounts) {
    this.store.dispatch(new sshKeyActions.SshKeyFilterUpdate({ selectedAccounts }));
  }

  private initFilters(): void {
    const params = this.filterService.getParams();
    const selectedGroupings = params['groupings'].reduce((acc, _) => {
      const grouping = this.groupings.find(g => g.key === _);
      if (grouping) {
        acc.push(grouping);
      }
      return acc;
    }, []);

    const selectedAccounts = params['accounts'];

    this.store.dispatch(new sshKeyActions.SshKeyFilterUpdate({
      selectedAccounts,
      selectedGroupings
    }));
  }

  private getGroupName(sshKey: SSHKeyPair) {
    return sshKey.domain !== 'ROOT'
      ? `${sshKey.domain}/${sshKey.account}`
      : sshKey.account;
  }
}
