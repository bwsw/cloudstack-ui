import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SSHKeyPair } from '../shared/models/ssh-keypair.model';


@Component({
  selector: 'cs-ssh-key-list',
  templateUrl: 'ssh-key-list.component.html',
})
export class SshKeyListComponent {
  @Input() public keys: Array<SSHKeyPair>;
  @Output() public onRemove = new EventEmitter<string>();
}
