import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { VirtualMachine } from '../shared/vm.model';
import { VirtualMachineAction } from './vm-action';

export interface IVirtualMachineCommand {
  commandName: string;
  vmStateOnAction: string;
}

@Injectable()
export abstract class VirtualMachineCommand extends VirtualMachineAction
  implements IVirtualMachineCommand {

  public abstract commandName: string;
  public abstract vmStateOnAction: string;

  protected onActionConfirmed(vm: VirtualMachine): Observable<any> {
    return this.addNotifications(this.vmService.command(vm, 'this'));
  }
}
