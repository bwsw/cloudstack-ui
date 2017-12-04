import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { SSHKeyPair } from '../../../../shared/models';
import { NotSelected } from '../../data/vm-creation-state';
import { State } from '../../../../reducers';

import * as fromSshKeys from '../../../../reducers/ssh-keys/redux/ssh-key.reducers';

@Component({
  selector: 'cs-vm-creation-ssh-key-selector-container',
  template: `
    <cs-vm-creation-ssh-key-selector
      [sshKeyPair]="sshKeyPair"
      [sshKeyPairs]="sshKeyPairs$ | async"
      (sshKeyPairChange)="onSshKeyPairChange($event)"
    ></cs-vm-creation-ssh-key-selector>`
})
export class VmCreationSshKeySelectorContainerComponent {
  readonly sshKeyPairs$ = this.store.select(fromSshKeys.selectAll);
  @Input() public sshKeyPair: SSHKeyPair | NotSelected;
  @Output() public sshKeyPairChange = new EventEmitter<SSHKeyPair | NotSelected>();

  constructor(private store: Store<State>) {
  }

  public onSshKeyPairChange(sshKeyPair: SSHKeyPair | NotSelected) {
    this.sshKeyPairChange.emit(sshKeyPair);
  }
}
