import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SSHKeyPair } from '../../../shared/models';
import { NotSelected } from '../data/vm-creation-state';


@Component({
  selector: 'cs-vm-creation-ssh-key-selector',
  templateUrl: 'ssh-key-selector.component.html',
})
export class VmCreationSshKeySelectorComponent {
  private _sshKeyPairs: Array<SSHKeyPair | NotSelected>;

  @Input()
  public set sshKeyPairs(list: Array<SSHKeyPair | NotSelected>) {
    const noSSHKeyText = this.translate.instant('VM_PAGE.VM_CREATION.NO_SSH_KEY');
    const sshKeyNotSelected = {
      name: noSSHKeyText,
      ignore: true
    };
    this._sshKeyPairs = [].concat([sshKeyNotSelected], list);

    if (!this.sshKeyPair) {
      this.sshKeyPairChange.emit(this._sshKeyPairs[0]);
    }
  }

  public get sshKeyPairs(): Array<SSHKeyPair | NotSelected> {
    return this._sshKeyPairs;
  }

  @Input() public sshKeyPair: SSHKeyPair | NotSelected;
  @Output() public sshKeyPairChange = new EventEmitter<SSHKeyPair | NotSelected>();

  constructor(private translate: TranslateService) {
  }
}
