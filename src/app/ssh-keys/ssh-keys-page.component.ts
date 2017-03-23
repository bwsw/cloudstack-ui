import { Component, OnInit } from '@angular/core';

import { SSHKeyPair } from '../shared/models/ssh-keypair.model';
import { SSHKeyPairService } from '../shared/services/SSHKeyPair.service';


@Component({
  selector: 'cs-ssh-keys-page',
  templateUrl: 'ssh-keys-page.component.html'
})
export class SshKeysPageComponent implements OnInit {
  public sshKeyList: Array<SSHKeyPair>;

  constructor(private sshKeyService: SSHKeyPairService) { }

  public ngOnInit(): void {
    this.sshKeyService
      .getList()
      .subscribe(keyList => this.sshKeyList = keyList);
  }

}
