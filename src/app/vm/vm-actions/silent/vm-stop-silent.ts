import { VirtualMachine } from '../../shared/vm.model';
import { Observable } from 'rxjs/Observable';
import { VmStopAction } from '../vm-stop';
import { Injectable } from '@angular/core';


@Injectable()
export class VmStopActionSilent extends VmStopAction {
  public activate(vm: VirtualMachine): Observable<VirtualMachine> {
    return this.vmService.command(vm, this);
  }
}
