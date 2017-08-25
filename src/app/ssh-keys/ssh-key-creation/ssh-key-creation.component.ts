import { Component, OnInit } from '@angular/core';
import { MdDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { SShKeyCreationDialogComponent } from './ssh-key-creation-dialog.component';
import { SshPrivateKeyDialogComponent } from './ssh-private-key-dialog.component';
import { SSHKeyPair } from '../../shared/models/ssh-keypair.model';
import { ListService } from '../../shared/components/list/list.service';

@Component({
  selector: 'cs-ssh-create-dialog',
  template: ``
})
export class SshKeyCreationComponent implements OnInit {
  constructor(
    private dialog: MdDialog,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private listService: ListService
  ) {
  }

  ngOnInit() {
    this.dialog.open(SShKeyCreationDialogComponent, {
      disableClose: true,
      width: '400px'
    })
      .afterClosed()
      .subscribe((sshKey: SSHKeyPair) => {
        if (sshKey) {
          this.listService.onUpdate.emit(sshKey);
          if (sshKey.privateKey) {
            this.showPrivateKey(sshKey.privateKey);
          }
        }
      });
  }

  private showPrivateKey(privateKey: string): void {
    this.dialog.open(SshPrivateKeyDialogComponent, {
      data: privateKey,
      width: '400px',
    }).afterClosed()
      .subscribe(() => {
        this.router.navigate(['../'], {
          preserveQueryParams: true,
          relativeTo: this.activatedRoute
        });
      });
  }
}
