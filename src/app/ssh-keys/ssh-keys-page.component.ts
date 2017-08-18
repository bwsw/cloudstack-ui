import { Component, OnInit } from '@angular/core';
import { MdDialog } from '@angular/material';
import { Observable } from 'rxjs';
import { DialogsService } from '../dialog/dialog-service/dialog.service';
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
    private dialogsService: DialogsService,
    private dialog: MdDialog,
    private sshKeyService: SSHKeyPairService
  ) {}

  public ngOnInit(): void {
    this.sshKeyService.getList()
      .subscribe(keyList => this.sshKeyList = sortBy(keyList, 'name'));
  }

  public showCreationDialog(): void {
    this.dialog.open(SShKeyCreationDialogComponent, {
      disableClose: true,
      width: '400px'
    })
      .afterClosed()
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
    this.dialog.open(SshPrivateKeyDialogComponent, {
      data: privateKey,
      width: '400px',
    });
  }

  private showRemovalDialog(name: string): void {
     this.dialogsService.confirm({ message: 'REMOVE_THIS_KEY'})
      .onErrorResumeNext()
      .switchMap((res) => {
        if (res) {
          this.setLoading(name);
          return this.sshKeyService.remove({ name });
        } else {
          return Observable.throw(null);
        }
      })
      .subscribe(
        () => this.sshKeyList = this.sshKeyList.filter(key => key.name !== name),
        (error) => {
          if (!error) {
            return;
          }
          this.setLoading(name, false);
          this.dialogsService.alert({ message: 'KEY_REMOVAL_FAILED' });
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
