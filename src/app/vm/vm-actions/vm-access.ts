import {
  MatDialog,
  MatDialogConfig
} from '@angular/material';
import { VmAccessComponent } from './vm-actions-component/vm-access.component';
import {
  VirtualMachine,
  VmState
} from '../shared/vm.model';
import { Injectable } from '@angular/core';

@Injectable()
export class VmAccessAction {
  public name = 'VM_PAGE.COMMANDS.VM_ACCESS';
  public icon = 'computer';

  constructor (private dialog: MatDialog) { }

  public canActivate(vm: VirtualMachine): boolean {
    return !!vm && vm.state === VmState.Running;
  }

  public activate(vm: VirtualMachine) {
    return this.dialog.open(VmAccessComponent, <MatDialogConfig>{
      width: '550px',
      data: vm
    });
  }
}
