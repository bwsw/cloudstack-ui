import { Component, OnInit } from '@angular/core';
import { DialogService } from '../../dialog/dialog-module/dialog.service';
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
    private dialogService: DialogService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private listService: ListService
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
          this.listService.onUpdate.emit(sshKey);
          if (sshKey.privateKey) {
            this.showPrivateKey(sshKey.privateKey);
          }
        } else {
          this.router.navigate(['../'], {
            preserveQueryParams: true,
            relativeTo: this.activatedRoute
          });
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
        this.router.navigate(['../'], {
          preserveQueryParams: true,
          relativeTo: this.activatedRoute
        });
      });
  }
}
