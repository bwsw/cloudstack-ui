import { Component, Input } from '@angular/core';
import { DialogService } from '../../dialog/dialog-service/dialog.service';
import { Store } from '@ngrx/store';
import { State } from '../../reducers/index';

import * as vmActions from '../../reducers/vm/redux/vm.actions';
import { VirtualMachine } from '../shared/vm.model';


@Component({
  selector: 'cs-vm-actions-container',
  template: `
    <cs-vm-actions
      [vm]="vm"
      (onVmDestroy)="onVmDestroy($event)"
      (onVmReboot)="onVmReboot($event)"
      (onVmResetPassword)="onVmResetPassword($event)"
      (onVmRestore)="onVmRestore($event)"
      (onVmStart)="onVmStart($event)"
      (onVmStop)="onVmStop($event)"
      (onVmExpunge)="onVmExpunge($event)"
      (onVmRecover)="onVmRecover($event)"
      (onVmAccess)="onVmAccess($event)"
      (onVmPulse)="onVmPulse($event)"
    >
    </cs-vm-actions>`,
})
export class VmActionsContainerComponent {

  @Input() public vm: VirtualMachine;

  constructor(
    public dialogService: DialogService,
    private store: Store<State>,
  ) {
  }

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
     this.dialogService.confirm({ message: 'DIALOG_MESSAGES.VM.CONFIRM_START' })
      .onErrorResumeNext()
      .filter(res => Boolean(res))
      .subscribe(() => {
        this.store.dispatch(new vmActions.StartVm(vm));
      });
  }

  public onVmStop(vm: VirtualMachine): void {
    this.dialogService.confirm({ message: 'DIALOG_MESSAGES.VM.CONFIRM_STOP' })
      .onErrorResumeNext()
      .filter(res => Boolean(res))
      .subscribe(() => {
        this.store.dispatch(new vmActions.StopVm(vm));
      });
  }

}
