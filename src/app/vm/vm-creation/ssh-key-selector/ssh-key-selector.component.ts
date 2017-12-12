import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SSHKeyPair } from '../../../shared/models';
import { NotSelected, NotSelectedSshKey } from '../data/vm-creation-state';


@Component({
  selector: 'cs-vm-creation-ssh-key-selector',
  templateUrl: 'ssh-key-selector.component.html',
})
export class VmCreationSshKeySelectorComponent {
  @Input() public sshKeyPairs: Array<SSHKeyPair | NotSelected>;
  @Input() public sshKeyPair: SSHKeyPair | NotSelected;
  @Output() public sshKeyPairChange = new EventEmitter<SSHKeyPair | NotSelected>();

  public get sshKeyNotSelected(): NotSelected {
    return NotSelectedSshKey;
  }
}
