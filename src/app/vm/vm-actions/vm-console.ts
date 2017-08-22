import { VirtualMachineAction, VmActions } from './vm-action';
import { VirtualMachine, VmState } from '../shared/vm.model';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';


@Injectable()
export class VmConsoleAction extends VirtualMachineAction {
  public action = VmActions.CONSOLE;
  public name = 'VM_PAGE.COMMANDS.CONSOLE';
  public icon = 'computer';

  public canActivate(vm: VirtualMachine): boolean {
    if (!vm) {
      return false;
    }

    return vm.state === VmState.Running;
  }

  public activate(vm: VirtualMachine): Observable<void> {
    window.open(
      `client/console?cmd=access&vm=${vm.id}`,
      vm.displayName,
      'resizable=0,width=820,height=640'
    );

    return Observable.of(null);
  }
}
