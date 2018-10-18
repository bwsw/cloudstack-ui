import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material';
import { filter } from 'rxjs/operators';

import { SSHKeyPair } from '../../../../shared/models/ssh-keypair.model';
import { DateTimeFormatterService } from '../../../../shared/services/date-time-formatter.service';
import { VirtualMachine, VmState } from '../../../shared/vm.model';
import { SshKeypairResetComponent } from '../../ssh-selector/ssh-keypair-reset.component';

@Component({
  selector: 'cs-vm-ssh-keypair',
  templateUrl: 'ssh-keypair.component.html',
})
export class SshKeypairComponent {
  @Input()
  public vm: VirtualMachine;
  @Input()
  public keys: SSHKeyPair[];
  @Output()
  public sshKeyChanged = new EventEmitter();

  constructor(
    public dateTimeFormatterService: DateTimeFormatterService,
    public dialog: MatDialog,
  ) {}

  public showSshKeypairResetDialog(): void {
    this.dialog
      .open(SshKeypairResetComponent, {
        width: '350px',
        disableClose: true,
        data: { keys: this.keys, sshKeyName: this.vm.keypair },
      })
      .afterClosed()
      .pipe(filter(Boolean))
      .subscribe(res => this.sshKeyChanged.emit(res));
  }

  public get canActivate() {
    return this.vm.state !== VmState.InProgress;
  }
}
