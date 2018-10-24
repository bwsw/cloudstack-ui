import { EventEmitter } from '@angular/core';
import { MatMenuTrigger } from '@angular/material';
import { SSHKeyPair } from '../../shared/models/ssh-keypair.model';

export class SshKeyItemComponent {
  public item: SSHKeyPair;
  public onClick = new EventEmitter<SSHKeyPair>();
  public onRemove = new EventEmitter<SSHKeyPair>();
  public matMenuTrigger: MatMenuTrigger;

  public onClicked(e: MouseEvent): void {
    e.stopPropagation();

    if (!this.matMenuTrigger || !this.matMenuTrigger.menuOpen) {
      this.onClick.emit(this.item);
    }
  }

  public onRemoveClicked(): void {
    this.onRemove.emit(this.item);
  }
}
