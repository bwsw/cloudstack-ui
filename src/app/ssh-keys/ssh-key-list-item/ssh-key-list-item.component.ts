import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MdMenuTrigger } from '@angular/material';
import { SSHKeyPair } from '../../shared/models/ssh-keypair.model';
import { AuthService } from "../../shared/services/auth.service";


@Component({
  selector: 'cs-ssh-key-list-item',
  templateUrl: 'ssh-key-list-item.component.html',
  styleUrls: ['ssh-key-list-item.component.scss']
})
export class SshKeyListItemComponent {
  @Input() public item: SSHKeyPair;
  @Output() public onClick = new EventEmitter<SSHKeyPair>();
  @Output() public onRemove = new EventEmitter<string>();
  @ViewChild(MdMenuTrigger) public mdMenuTrigger: MdMenuTrigger;

  constructor(private authService: AuthService) {}

  public onClicked(e: MouseEvent): void {
    e.stopPropagation();

    if (!this.mdMenuTrigger.menuOpen) {
      this.onClick.emit(this.item);
    }
  }

  public onRemoveClicked(): void {
    this.onRemove.emit(this.item.name);
  }

  public get isSelf(): boolean {
    return this.authService.user.username === this.item.account;
  }
}
