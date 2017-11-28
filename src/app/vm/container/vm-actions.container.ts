import {
  Component,
  Input
} from '@angular/core';
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

  public onVmExpunge(vm: VirtualMachine): void {
    this.store.dispatch(new vmActions.ExpungeVm(vm));
  }

  public onVmDestroy(event): void {
    this.store.dispatch(new vmActions.DestroyVm(event));
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
    this.store.dispatch(new vmActions.StartVm(vm));
  }

  public onVmStop(vm: VirtualMachine): void {
    this.store.dispatch(new vmActions.StopVm(vm));
  }

}
