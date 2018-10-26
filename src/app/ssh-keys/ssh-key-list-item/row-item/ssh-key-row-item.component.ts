import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material';
import { SSHKeyPair } from '../../../shared/models/ssh-keypair.model';
import { SshKeyItemComponent } from '../ssh-key-item.component';

@Component({
  selector: 'cs-ssh-key-row-item',
  templateUrl: 'ssh-key-row-item.component.html',
  styleUrls: ['ssh-key-row-item.component.scss'],
})
export class SshKeyRowItemComponent extends SshKeyItemComponent {
  @Input()
  public item: SSHKeyPair;
  // tslint:disable-next-line:no-output-on-prefix
  @Output()
  public onClick = new EventEmitter<SSHKeyPair>();
  // tslint:disable-next-line:no-output-on-prefix
  @Output()
  public onRemove = new EventEmitter<SSHKeyPair>();
  @ViewChild(MatMenuTrigger)
  public matMenuTrigger: MatMenuTrigger;
}
