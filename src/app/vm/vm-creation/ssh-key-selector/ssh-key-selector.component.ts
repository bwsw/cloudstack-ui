import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SSHKeyPair } from '../../../shared/models';
import { NotSelected } from '../data/vm-creation-state';

export const notSelectedSshKey: NotSelected = {
  name: 'VM_PAGE.VM_CREATION.NO_SSH_KEY',
  ignore: true,
};

@Component({
  selector: 'cs-vm-creation-ssh-key-selector',
  templateUrl: 'ssh-key-selector.component.html',
})
export class VmCreationSshKeySelectorComponent {
  @Input()
  public sshKeyPairs: (SSHKeyPair | NotSelected)[];
  @Input()
  public sshKeyPair: SSHKeyPair | NotSelected;
  @Output()
  public sshKeyPairChange = new EventEmitter<SSHKeyPair | NotSelected>();

  public get sshKeyNotSelected(): NotSelected {
    return notSelectedSshKey;
  }
}
