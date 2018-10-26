import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter, onErrorResumeNext } from 'rxjs/operators';

import { State } from '../../reducers';
import { DialogService } from '../../dialog/dialog-service/dialog.service';
import { VirtualMachine } from '../shared/vm.model';
import * as vmActions from '../../reducers/vm/redux/vm.actions';

@Component({
  selector: 'cs-vm-actions-container',
  template: `
    <cs-vm-actions
      [vm]="vm"
      (vmDestroyed)="onVmDestroy($event)"
      (vmRebooted)="onVmReboot($event)"
      (vmResetedPassword)="onVmResetPassword($event)"
      (vmRestored)="onVmRestore($event)"
      (vmStarted)="onVmStart($event)"
      (vmStopped)="onVmStop($event)"
      (vmExpunged)="onVmExpunge($event)"
      (vmRecovered)="onVmRecover($event)"
      (vmAccessed)="onVmAccess($event)"
      (vmPulse)="onVmPulse($event)"
      (vmLogs)="onViewVmLogs($event)"
    >
    </cs-vm-actions>`,
})
export class VmActionsContainerComponent {
  @Input()
  public vm: VirtualMachine;

  constructor(public dialogService: DialogService, private store: Store<State>) {}

  public onVmRecover(vm: VirtualMachine): void {
    this.store.dispatch(new vmActions.RecoverVm(vm));
  }

  public onVmAccess(vm: VirtualMachine): void {
    this.store.dispatch(new vmActions.AccessVm(vm));
  }

  public onVmPulse(vm: VirtualMachine): void {
    this.store.dispatch(new vmActions.PulseVm(vm));
  }

  public onVmExpunge(vm: VirtualMachine): void {
    this.store.dispatch(new vmActions.ExpungeVm(vm));
  }

  public onVmDestroy(vm: VirtualMachine): void {
    this.store.dispatch(new vmActions.DestroyVm(vm));
  }

  public onVmReboot(vm: VirtualMachine): void {
    this.store.dispatch(new vmActions.RebootVm(vm));
  }

  public onVmResetPassword(vm: VirtualMachine): void {
    this.store.dispatch(new vmActions.ResetPasswordVm(vm));
  }

  public onVmRestore(vm: VirtualMachine): void {
    this.store.dispatch(new vmActions.RestoreVm(vm));
  }

  public onVmStart(vm: VirtualMachine): void {
    this.dialogService
      .confirm({ message: 'DIALOG_MESSAGES.VM.CONFIRM_START' })
      .pipe(
        onErrorResumeNext(),
        filter(Boolean),
      )
      .subscribe(() => {
        this.store.dispatch(new vmActions.StartVm(vm));
      });
  }

  public onVmStop(vm: VirtualMachine): void {
    this.dialogService
      .confirm({ message: 'DIALOG_MESSAGES.VM.CONFIRM_STOP' })
      .pipe(
        onErrorResumeNext(),
        filter(Boolean),
      )
      .subscribe(() => {
        this.store.dispatch(new vmActions.StopVm(vm));
      });
  }

  public onViewVmLogs(vm: VirtualMachine): void {
    this.store.dispatch(new vmActions.ViewVmLogs(vm));
  }
}
