import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Action } from '../../../shared/interfaces/action.interface';
import { VirtualMachine } from '../../shared/vm.model';
import { VmConsoleAction } from '../../vm-actions/vm-console';

@Injectable()
export class VmVncConsoleAction implements Action<VirtualMachine> {
  public name = 'vncConsole';

  constructor(private vmConsole: VmConsoleAction) {}

  public canActivate(vm: VirtualMachine): boolean {
    return !!vm.isoId; // created from ISO
  }

  public activate(model: VirtualMachine): Observable<void> {
    return this.vmConsole.activate(model);
  }
}
