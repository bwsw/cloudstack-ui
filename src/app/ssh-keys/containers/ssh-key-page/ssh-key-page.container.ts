import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '../../../reducers';
import * as sshKeyActions from '../../../reducers/ssh-keys/redux/ssh-key.actions';

import * as fromSshKeys from '../../../reducers/ssh-keys/redux/ssh-key.reducers';
import { Grouping } from '../../../shared/models/grouping.model';
import { SSHKeyPair } from '../../../shared/models/ssh-keypair.model';


export const sshKeyGroupings: Array<Grouping> = [
  {
    key: 'accounts',
    label: 'SSH_KEYS.FILTERS.GROUP_BY_ACCOUNTS',
    selector: (item: SSHKeyPair) => item.account,
    name: (item: SSHKeyPair) => getGroupName(item)
  }
];


const getGroupName = (sshKey: SSHKeyPair) => {
  return sshKey.domain !== 'ROOT'
    ? `${sshKey.domain}/${sshKey.account}`
    : sshKey.account;
};

@Component({
  selector: 'cs-ssh-key-page-container',
  template: `
    <cs-ssh-keys-page
      [sshKeyList]="sshKeyList$ | async"
      [isLoading]="isLoading$ | async"
      [selectedGroupings]="selectedGroupings$ | async"
      (onKeyRemove)="removeSshKeyPair($event)"
    ></cs-ssh-keys-page>`
})
export class SshKeyPageContainerComponent implements OnInit, AfterViewInit {
  readonly isLoading$ = this.store.select(fromSshKeys.isLoading);
  readonly sshKeyList$ = this.store.select(fromSshKeys.selectFilteredSshKeys);
  readonly selectedGroupings$ = this.store.select(fromSshKeys.filterSelectedGroupings);

  constructor(
    private store: Store<State>,
    private cd: ChangeDetectorRef
  ) {
  }


  ngOnInit() {
    this.store.dispatch(new sshKeyActions.LoadSshKeyRequest());
  }

  ngAfterViewInit() {
    this.cd.detectChanges();
  }

  public removeSshKeyPair(sshKeyPair: SSHKeyPair) {
    this.store.dispatch(new sshKeyActions.RemoveSshKeyPair(sshKeyPair));
  }
}
