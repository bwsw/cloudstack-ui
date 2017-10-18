import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SshKeyCreationData } from '../../shared/services/ssh-keypair.service';

@Component({
  selector: 'cs-ssh-key-creation',
  templateUrl: 'ssh-key-creation-dialog.component.html'
})
export class SshKeyCreationDialogComponent {
  public name: string;
  public publicKey: string;

  @Input() public isLoading: boolean;
  @Output() public onSshKeyPairCreation = new EventEmitter<SshKeyCreationData>();

  public onSubmit(e): void {
    e.preventDefault();
    const sshKeyCreationParams = {
      name: this.name,
      publicKey: this.publicKey
    };

    this.onSshKeyPairCreation.emit(sshKeyCreationParams);
  }
}
