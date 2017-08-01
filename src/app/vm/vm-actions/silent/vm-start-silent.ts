import { VmStartAction } from '../vm-start';
import { VirtualMachine } from '../../shared/vm.model';
import { Observable } from 'rxjs/Observable';


export class VmStartActionSilent extends VmStartAction {
  public activate(vm: VirtualMachine): Observable<any> {
    return this.vmService.command(vm, this);
  }
}
