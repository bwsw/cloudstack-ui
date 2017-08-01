import { VirtualMachineAction, VmActions } from './vm-action';
import { VirtualMachine, VmStates } from '../shared/vm.model';
import { Observable } from 'rxjs/Observable';


export class VmConsoleAction extends VirtualMachineAction {
  public action = VmActions.CONSOLE;
  public name = 'CONSOLE';
  public icon = 'computer';

  public canActivate(vm: VirtualMachine): boolean {
    return vm.state === VmStates.Running;
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
