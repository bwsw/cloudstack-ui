import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import {
  MatDialog,
  MatDialogConfig
} from '@angular/material';
import { DateTimeFormatterService } from '../../../../shared/services/date-time-formatter.service';
import {
  VirtualMachine,
  VmState
} from '../../../shared/vm.model';
import { SshKeypairResetComponent } from '../../ssh-selector/ssh-keypair-reset.component';
import { Observable } from 'rxjs/Observable';
import { DialogService } from '../../../../dialog/dialog-service/dialog.service';


@Component({
  selector: 'cs-vm-ssh-keypair',
  templateUrl: 'ssh-keypair.component.html'
})
export class SshKeypairComponent {
  @Input() public vm: VirtualMachine;
  @Output() public onSshKeyChange = new EventEmitter();
  @Output() public onVirtualMachineStop = new EventEmitter();

  constructor(
    public dateTimeFormatterService: DateTimeFormatterService,
    private dialog: MatDialog,
    private dialogService: DialogService
  ) {
  }

  public resetSshKey(): void {
    this.askToStopVM(this.vm)
      .filter(stopped => !!stopped)
      .subscribe(() => this.showSshKeypairResetDialog());
  }

  private showSshKeypairResetDialog(): void {
    this.dialog.open( SshKeypairResetComponent,<MatDialogConfig>{
      width: '350px' ,
      data: this.vm ,
      disableClose: true
    }).afterClosed()
      .subscribe((keyPairName: string) => {
        if (keyPairName) {
          let vm = Object.assign({}, this.vm);
          vm.keyPair = keyPairName;
          this.onSshKeyChange.emit(vm);
        }
      });
  }

  private askToStopVM(currentVM: VirtualMachine): Observable<any> {
    if (currentVM.state === VmState.Stopped) {
      return Observable.of(true);
    } else {
      return this.dialogService.confirm({
        message: 'VM_PAGE.VM_DETAILS.AFFINITY_GROUP.STOP_MACHINE_FOR_AG',
        confirmText: 'VM_PAGE.COMMANDS.STOP',
        declineText: 'COMMON.CANCEL'
      })
        .onErrorResumeNext()
        .filter(res => Boolean(res))
        .map(() => {
          this.onVirtualMachineStop.emit(currentVM);
          return Observable.of(false);
        });
    }
  }
}
