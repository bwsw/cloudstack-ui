import { Component, Input } from '@angular/core';
import { SSHKeyPair } from '../../shared/models/ssh-keypair.model';

@Component({
  selector: 'cs-ssh-key-fingerprint',
  templateUrl: 'ssh-key-fingerprint.component.html',
  styleUrls: ['ssh-key-fingerprint.component.scss'],
})
export class SshKeyFingerprintComponent {
  @Input()
  public sshKeyPair: SSHKeyPair;
}
