import { Component, OnInit } from '@angular/core';
import { MdlDialogService } from 'angular2-mdl';
import { TranslateService } from 'ng2-translate';

import { SSHKeyPair } from '../shared/models/ssh-keypair.model';
import { SSHKeyPairService } from '../shared/services/ssh-keypair.service';
import { SShKeyCreationDialogComponent } from './ssh-key-creation-dialog.component';


@Component({
  selector: 'cs-ssh-keys-page',
  templateUrl: 'ssh-keys-page.component.html'
})
export class SshKeysPageComponent implements OnInit {
  public sshKeyList: Array<SSHKeyPair>;

  constructor(
    private sshKeyService: SSHKeyPairService,
    private dialogService: MdlDialogService,
    private translateService: TranslateService
  ) { }

  public ngOnInit(): void {
    this.sshKeyService
      .getList()
      .subscribe(keyList => this.sshKeyList = keyList);
  }

  public showCreationDialog(): void {
    this.dialogService.showCustomDialog({
      component: SShKeyCreationDialogComponent,
      styles: { width: '400px' }
    })
      .switchMap(res => res.onHide())
      .subscribe(data => this.createSshKey(data));
  }

  private createSshKey(data) {
    if (!data) {
      return;
    }

    const keyCreationObs = data.publicKey ? this.sshKeyService.register(data) : this.sshKeyService.create(data);
    keyCreationObs.subscribe(
      (sshKey: SSHKeyPair) => {
        this.sshKeyList = this.sshKeyList.concat(sshKey);
        if (sshKey.privateKey) {
          this.showPrivateKey(sshKey.privateKey);
        }
      },
      (error) => this.handleError(error)
    );
  }

  private showPrivateKey(privateKey: string): void {
    this.dialogService.showDialog({
      message: privateKey,
      actions: [{
        handler: () => { },
        text: 'Ok' ,
        isClosingAction: true
      }],
      isModal: true,
      styles: { width: '400px', 'word-break': 'break-all' }
    });
  }

  private handleError(error): void {
    const errorMap = {
      'A key pair with name': 'KEYPAIR_ALREADY_EXISTS',
      'Public key is invalid': 'INVALID_PUBLIC_KEY'
    };

    let message;
    for (let key in errorMap) {
      if (error.errortext.startsWith(key)) {
        message = errorMap[key];
        break;
      }
    }
    if (!message) {
      message = error.errortext;
    }

    this.translateService.get(message)
      .subscribe((message) => this.dialogService.alert(message));
  }
}
