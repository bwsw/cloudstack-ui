import { Component, OnInit } from '@angular/core';
import { MdlDialogService } from 'angular2-mdl';

import { SSHKeyPair } from '../shared/models/ssh-keypair.model';
import { SSHKeyPairService } from '../shared/services/SSHKeyPair.service';
import { TranslateService } from 'ng2-translate';


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

  public removeKey(name: string): void {
    this.translateService.get(['REMOVE_THIS_KEY', 'YES', 'NO', 'KEY_REMOVAL_FAILED'])
      .subscribe(translations => this.showRemovalDialog(name, translations));
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
