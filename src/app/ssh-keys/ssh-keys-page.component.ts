import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { SSHKeyPair } from '../shared/models';
import { DialogService } from '../shared/services/dialog.service';
import { SshKeyCreationData, SSHKeyPairService } from '../shared/services/ssh-keypair.service';
import { SShKeyCreationDialogComponent } from './ssh-key-creation/ssh-key-creation-dialog.component';
import { SshPrivateKeyDialogComponent } from './ssh-key-creation/ssh-private-key-dialog.component';
import sortBy = require('lodash/sortBy');
import { Observable } from 'rxjs/Observable';


@Component({
  selector: 'cs-ssh-keys-page',
  templateUrl: 'ssh-keys-page.component.html',
  styleUrls: ['ssh-keys-page.component.scss']
})
export class SshKeysPageComponent implements OnInit {
  public sshKeyList: Array<SSHKeyPair>;
  public sshCreationFormData: SshKeyCreationData;

  constructor(
    private sshKeyService: SSHKeyPairService,
    private dialogService: DialogService,
    private translateService: TranslateService
  ) { }

  public ngOnInit(): void {
    this.sshKeyService.getList()
      .subscribe(keyList => this.sshKeyList = sortBy(keyList, 'name'));
  }

  public showCreationDialog(): void {
    this.dialogService.showCustomDialog({
      component: SShKeyCreationDialogComponent,
      providers: [{ provide: 'formData', useValue: this.sshCreationFormData }],
      styles: { width: '400px' }
    })
      .switchMap(res => res.onHide())
      .subscribe(data => {
        this.sshCreationFormData = undefined;
        if (!data) { return; }
        this.createSshKey(data).subscribe(
          () => {},
          error => {
            this.sshCreationFormData = data;
            this.handleError(error);
          }
        );
      });
  }

  public removeKey(name: string): void {
    this.showRemovalDialog(name);
  }

  private createSshKey(data: SshKeyCreationData): Observable<void> {
    if (!data) {
      return;
    }

    const keyCreationObs = data.publicKey ? this.sshKeyService.register(data) : this.sshKeyService.create(data);
    return keyCreationObs.map(
      (sshKey: SSHKeyPair) => {
        this.sshKeyList = sortBy(this.sshKeyList.concat(sshKey), 'name');
        if (sshKey.privateKey) {
          this.showPrivateKey(sshKey.privateKey);
        }
      });
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

  private showRemovalDialog(name: string): void {
    this.dialogService.confirm('REMOVE_THIS_KEY', 'NO', 'YES')
      .onErrorResumeNext()
      .switchMap(() => {
        this.setLoading(name);
        return this.sshKeyService.remove({ name });
      })
      .subscribe(
        () => this.sshKeyList = this.sshKeyList.filter(key => key.name !== name),
        () => {
          this.setLoading(name, false);
          this.dialogService.alert('KEY_REMOVAL_FAILED');
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
