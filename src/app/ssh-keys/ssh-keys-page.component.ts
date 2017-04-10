import { Component, OnInit } from '@angular/core';
import { MdlDialogService } from 'angular2-mdl';
import { TranslateService } from 'ng2-translate';

import { SSHKeyPair } from '../shared/models/ssh-keypair.model';
import { SshKeyCreationData, SSHKeyPairService } from '../shared/services/ssh-keypair.service';
import { SShKeyCreationDialogComponent } from './ssh-key-creation/ssh-key-creation-dialog.component';
import { SshPrivateKeyDialogComponent } from './ssh-key-creation/ssh-private-key-dialog.component';


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

  public removeKey(name: string): void {
    this.translateService.get(['REMOVE_THIS_KEY', 'YES', 'NO', 'KEY_REMOVAL_FAILED'])
      .subscribe(translations => this.showRemovalDialog(name, translations));
  }

  private createSshKey(data: SshKeyCreationData): void {
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
    this.dialogService.showCustomDialog({
      component: SshPrivateKeyDialogComponent,
      providers: [{ provide: 'privateKey', useValue: privateKey }],
      styles: { width: '400px', 'word-break': 'break-all' }
    });
  }

  private handleError(error): void {
    this.translateService.get(error.message, error.params)
      .subscribe((msg) => this.dialogService.alert(msg));
  }

  private showRemovalDialog(name: string, translations: Array<string>): void {
    this.dialogService.confirm(
      translations['REMOVE_THIS_KEY'],
      translations['NO'],
      translations['YES'],
    )
      .onErrorResumeNext()
      .switchMap(() => {
        this.setLoading(name);
        return this.sshKeyService.remove({ name });
      })
      .subscribe(
        () => this.sshKeyList = this.sshKeyList.filter(key => key.name !== name),
        () => {
          this.setLoading(name, false);
          this.dialogService.alert(translations['KEY_REMOVAL_FAILED']);
        }
      );
  }

  private setLoading(name, value = true): void {
    const sshKey: SSHKeyPair = this.sshKeyList.find(key => key.name === name);
    if (!sshKey) {
      return;
    }

    sshKey['loading'] = value;
  }
}
