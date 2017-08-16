import { Component, OnInit } from '@angular/core';
import { DialogService } from '../dialog/dialog-module/dialog.service';
import { SSHKeyPair } from '../shared/models';
import { SSHKeyPairService } from '../shared/services/ssh-keypair.service';
import { SShKeyCreationDialogComponent } from './ssh-key-creation/ssh-key-creation-dialog.component';
import { SshPrivateKeyDialogComponent } from './ssh-key-creation/ssh-private-key-dialog.component';
import * as sortBy from 'lodash/sortBy';


@Component({
  selector: 'cs-ssh-keys-page',
  templateUrl: 'ssh-keys-page.component.html',
  styleUrls: ['ssh-keys-page.component.scss']
})
export class SshKeysPageComponent implements OnInit {
  public sshKeyList: Array<SSHKeyPair>;

  constructor(
    private dialogService: DialogService,
    private sshKeyService: SSHKeyPairService
  ) {}

  public ngOnInit(): void {
    this.sshKeyService.getList()
      .subscribe(keyList => this.sshKeyList = sortBy(keyList, 'name'));
  }

  public showCreationDialog(): void {
    this.dialogService.showCustomDialog({
      component: SShKeyCreationDialogComponent,
      clickOutsideToClose: false,
      styles: {
        width: '400px'
      }
    })
      .switchMap(res => res.onHide())
      .subscribe((sshKey: SSHKeyPair) => {
        if (sshKey) {
          this.sshKeyList = sortBy(this.sshKeyList.concat(sshKey), 'name');
          if (sshKey.privateKey) {
            this.showPrivateKey(sshKey.privateKey);
          }
        }
      });
  }

  public removeKey(name: string): void {
    this.showRemovalDialog(name);
  }

  private showPrivateKey(privateKey: string): void {
    this.dialogService.showCustomDialog({
      component: SshPrivateKeyDialogComponent,
      providers: [{ provide: 'privateKey', useValue: privateKey }],
      styles: {
        width: '400px',
        'word-break': 'break-all'
      }
    });
  }

  private showRemovalDialog(name: string): void {
    this.dialogService.confirm('REMOVE_THIS_KEY', 'COMMON.NO', 'COMMON.YES')
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
