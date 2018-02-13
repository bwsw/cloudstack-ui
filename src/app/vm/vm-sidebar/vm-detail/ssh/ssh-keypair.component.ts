import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { SSHKeyPair } from '../../../../shared/models/ssh-keypair.model';
import { DateTimeFormatterService } from '../../../../shared/services/date-time-formatter.service';
import { VirtualMachine, VmState } from '../../../shared/vm.model';
import { SshKeypairResetComponent } from '../../ssh-selector/ssh-keypair-reset.component';


@Component({
  selector: 'cs-vm-ssh-keypair',
  templateUrl: 'ssh-keypair.component.html'
})
export class SshKeypairComponent {
  @Input() public vm: VirtualMachine;
  @Input() public keys: Array<SSHKeyPair>;
  @Output() public onSshKeyChange = new EventEmitter();

  constructor(
    public dateTimeFormatterService: DateTimeFormatterService,
    public dialog: MatDialog,
  ) {
  }

  public showSshKeypairResetDialog(): void {
    this.dialog.open( SshKeypairResetComponent, <MatDialogConfig>{
      width: '350px' ,
      disableClose: true,
      data: { keys: this.keys, sshKeyName: this.vm.keyPair }
    }).afterClosed()
      .filter(res => Boolean(res))
      .subscribe(res => this.onSshKeyChange.emit(res));
  }

  public get canActivate() {
    return this.vm.state !== VmState.InProgress;
  }
}
