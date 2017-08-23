import { Component, OnInit } from '@angular/core';
import { DialogService } from '../../dialog/dialog-module/dialog.service';
import { Router } from '@angular/router';
import { SShKeyCreationDialogComponent } from './ssh-key-creation-dialog.component';
import { SshPrivateKeyDialogComponent } from './ssh-private-key-dialog.component';
import { SSHKeyPair } from '../../shared/models/ssh-keypair.model';
import { SSHKeyPairService } from '../../shared/services/ssh-keypair.service';

@Component({
  selector: 'cs-ssh-create-dialog',
  template: ``
})
export class SshKeyCreationComponent implements OnInit {
  constructor(
    private dialogService: DialogService,
    private router: Router,
    private sshKeyService: SSHKeyPairService
  ) {
  }

  ngOnInit() {
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
          this.sshKeyService.onCreation.next(sshKey);
          if (sshKey.privateKey) {
            this.showPrivateKey(sshKey.privateKey);
          }
        }
      });
  }

  private showPrivateKey(privateKey: string): void {
    this.dialogService.showCustomDialog({
      component: SshPrivateKeyDialogComponent,
      providers: [{ provide: 'privateKey', useValue: privateKey }],
      styles: {
        width: '400px',
        'word-break': 'break-all'
      }
    })
      .switchMap(res => res.onHide())
      .subscribe(() => {
        this.router.navigate(['/ssh-keys']);
      });
  }
}
