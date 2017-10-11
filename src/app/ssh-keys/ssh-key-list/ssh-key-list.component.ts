import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SSHKeyPair } from '../../shared/models/ssh-keypair.model';
import { ListService } from '../../shared/components/list/list.service';
import { SshKeyListItemComponent } from '../ssh-key-list-item/ssh-key-list-item.component';


@Component({
  selector: 'cs-ssh-key-list',
  templateUrl: 'ssh-key-list.component.html',
})
export class SshKeyListComponent {
  @Input() public keys: Array<SSHKeyPair>;
  @Input() public groupings: Array<any>;
  @Output() public onRemove = new EventEmitter<SSHKeyPair>();
  public inputs;
  public outputs;

  public SshKeyListItemComponent = SshKeyListItemComponent;

  constructor(private listService: ListService) {
    this.outputs = {
      onClick: this.selectSshKeyPair.bind(this),
      onRemove: this.removeKeyPair.bind(this)
    };
  }

  public selectSshKeyPair(sshKeyPair: SSHKeyPair): void {
    this.listService.showDetails(sshKeyPair.name);
  }

  public removeKeyPair(sshKeyPair: SSHKeyPair): void {
    this.onRemove.emit(sshKeyPair);
  }
}
