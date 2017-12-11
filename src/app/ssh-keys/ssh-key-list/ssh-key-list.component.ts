import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { SSHKeyPair } from '../../shared/models/ssh-keypair.model';
import { SshKeyCardItemComponent } from '../ssh-key-list-item/card-item/ssh-key-card-item.component';
import {
  ActivatedRoute,
  Router
} from '@angular/router';
import { ViewMode } from '../../shared/components/view-mode-switch/view-mode-switch.component';
import { SshKeyRowItemComponent } from '../ssh-key-list-item/row-item/ssh-key-row-item.component';
import { Grouping } from '../../shared/models/grouping.model';


@Component({
  selector: 'cs-ssh-key-list',
  templateUrl: 'ssh-key-list.component.html',
})
export class SshKeyListComponent {
  @Input() public keys: Array<SSHKeyPair>;
  @Input() public groupings: Array<Grouping>;
  @Input() public mode: ViewMode;
  @Output() public onRemove = new EventEmitter<SSHKeyPair>();
  public inputs;
  public outputs;

  constructor(private route: ActivatedRoute, private router: Router) {
    this.outputs = {
      onClick: this.selectSshKeyPair.bind(this),
      onRemove: this.removeKeyPair.bind(this)
    };
  }

  public get itemComponent() {
    return this.mode === ViewMode.BOX ? SshKeyCardItemComponent : SshKeyRowItemComponent;
  }

  public selectSshKeyPair(sshKeyPair: SSHKeyPair): void {
    this.router.navigate(['view', sshKeyPair.name], {
      relativeTo: this.route,
      queryParams: {account: sshKeyPair.account}
    });
  }

  public removeKeyPair(sshKeyPair: SSHKeyPair): void {
    this.onRemove.emit(sshKeyPair);
  }
}
