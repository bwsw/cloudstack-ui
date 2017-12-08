import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { DateTimeFormatterService } from '../../../../shared/services/date-time-formatter.service';
import { VirtualMachine } from '../../../shared/vm.model';
import {
  MatDialog,
  MatDialogConfig
} from '@angular/material';
import { SshKeypairResetComponent } from '../../ssh-selector/ssh-keypair-reset.component';


@Component({
  selector: 'cs-vm-ssh-keypair',
  templateUrl: 'ssh-keypair.component.html'
})
export class SshKeypairComponent {
  @Input() public vm: VirtualMachine;
  @Output() public onSshKeyChange = new EventEmitter();

  constructor(
    public dateTimeFormatterService: DateTimeFormatterService,
    public dialog: MatDialog,
  ) {
  }

  public showSshKeypairResetDialog(): void {
    this.dialog.open( SshKeypairResetComponent, <MatDialogConfig>{
      data: { sshKeyName: this.vm.keyPair},
      width: '350px' ,
      disableClose: true
    }).afterClosed()
      .filter(res => Boolean(res))
      .subscribe(res => this.onSshKeyChange.emit(res));
  }
}
