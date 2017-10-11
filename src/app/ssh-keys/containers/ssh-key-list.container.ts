import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '../../reducers/index';
import { SessionStorageService } from '../../shared/services/session-storage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { WithUnsubscribe } from '../../utils/mixins/with-unsubscribe';
import { FilterService } from '../../shared/services/filter.service';
import { SSHKeyPair } from '../../shared/models/ssh-keypair.model';

import * as fromSshKeys from '../redux/ssh-key.reducers';
import * as sshKeyActions from '../redux/ssh-key.actions';


@Component({
  selector: 'cs-ssh-key-page-container',
  templateUrl: 'ssh-key-list.container.html'
})
export class SshKeyListContainerComponent extends WithUnsubscribe() implements OnInit {
  readonly sshKeyList$ = this.store.select(fromSshKeys.selectFilteredSshKeys);
  readonly filters$ = this.store.select(fromSshKeys.filters);
  readonly selectedGroupings$ = this.store.select(fromSshKeys.filterSelectedGroupings);

  private filterService = new FilterService(
    {
      'groupings': { type: 'array', defaultOption: [] }
    },
    this.router,
    this.sessionStorage,
    'sshKeyListFilters',
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
    console.log(this.store.select(fromSshKeys.getSshKeysEntitiesState));
    this.initFilters();
    this.filters$
      .takeUntil(this.unsubscribe$)
      .subscribe(filters =>
        this.filterService.update({
          'groupings': filters.selectedGroupings
        }));
  }

  public onGroupingChange(selectedGroupings) {
    this.store.dispatch(new sshKeyActions.SshKeyFilterUpdate({ selectedGroupings }));
  }

  public createSshKeyPair(value) {
    this.store.dispatch(new sshKeyActions.CreateSshKeyPair(value));
  }

  public removeSshKeyPair(sshKeyPair: SSHKeyPair) {
    this.store.dispatch(new sshKeyActions.RemoveSshKeyPair(sshKeyPair));
  }

  private initFilters(): void {
    const params = this.filterService.getParams();
    const selectedGroupings = params['groupings'];
    this.store.dispatch(new sshKeyActions.SshKeyFilterUpdate({ selectedGroupings }));
  }
}
