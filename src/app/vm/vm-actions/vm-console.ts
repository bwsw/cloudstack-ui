import { VirtualMachineAction, VmActions } from './vm-action';
import { VmStates } from '../shared/vm.model';
import { Observable } from 'rxjs/Observable';


export class VmConsoleAction extends VirtualMachineAction {
  public action = VmActions.CONSOLE;
  public name = 'CONSOLE';
  public icon = 'computer';

  public canActivate(): boolean {
    return this.vm.state === VmStates.Running;
  }

  public activate(): Observable<void> {
    window.open(
      `client/console?cmd=access&vm=${this.vm.id}`,
      this.vm.displayName,
      'resizable=0,width=820,height=640'
    );

    return Observable.of(null);
  }
}
