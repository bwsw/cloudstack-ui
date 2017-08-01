import { VirtualMachine } from '../../shared/vm.model';
import { Observable } from 'rxjs/Observable';
import { VmStopAction } from '../vm-stop';


export class VmStopActionSilent extends VmStopAction {
  public activate(vm: VirtualMachine): Observable<any> {
    return this.vmService.command(vm, this);
  }
}
