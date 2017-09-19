import { Component, Input } from '@angular/core';
import { SSHKeyPair } from '../../shared/models/ssh-keypair.model';


@Component({
  selector: 'cs-ssh-key-fingerprint',
  templateUrl: 'ssh-key-fingerprint.component.html'
})
export class SshKeyFingerprintComponent {
  @Input() public sshKeyPair: SSHKeyPair;
}
