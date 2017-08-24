import { Component, OnInit } from '@angular/core';
import { DialogService } from '../dialog/dialog-module/dialog.service';
import { SSHKeyPair } from '../shared/models';
import { SSHKeyPairService } from '../shared/services/ssh-keypair.service';
import * as sortBy from 'lodash/sortBy';
import { ActivatedRoute, Router } from '@angular/router';
import { ListService } from '../shared/components/list/list.service';


@Component({
  selector: 'cs-ssh-keys-page',
  templateUrl: 'ssh-keys-page.component.html',
  styleUrls: ['ssh-keys-page.component.scss'],
  providers: [ListService]
})
export class SshKeysPageComponent implements OnInit {
  public sshKeyList: Array<SSHKeyPair>;

  constructor(
    private dialogService: DialogService,
    private sshKeyService: SSHKeyPairService,
    private listService: ListService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
  }

  public ngOnInit(): void {
    this.update();

    this.listService.onUpdate.subscribe(() => this.update());
  }

  public showCreationDialog(): void {
    this.router.navigate(['./create'], {
      preserveQueryParams: true,
      relativeTo: this.activatedRoute
    });  }

  public removeKey(name: string): void {
    this.showRemovalDialog(name);
  }

  private showRemovalDialog(name: string): void {
    this.dialogService.confirm(
      'SSH_KEYS.REMOVE_THIS_KEY',
      'COMMON.NO',
      'COMMON.YES'
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
          this.dialogService.alert('SSH_KEYS.KEY_REMOVAL_FAILED');
        }
      );
  }

  private update() {
    this.sshKeyService.getList()
      .subscribe(keyList => this.sshKeyList = sortBy(keyList, 'name'));
  }

  private setLoading(name, value = true): void {
    const sshKey: SSHKeyPair = this.sshKeyList.find(key => key.name === name);
    if (!sshKey) {
      return;
    }

    sshKey['loading'] = value;
  }
}
