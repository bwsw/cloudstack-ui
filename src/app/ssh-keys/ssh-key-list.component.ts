import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { SSHKeyPair } from '../shared/models/ssh-keypair.model';


@Component({
  selector: 'cs-ssh-key-list',
  templateUrl: 'ssh-key-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SshKeyListComponent {
  @Input() public keys: Array<SSHKeyPair>;
}
