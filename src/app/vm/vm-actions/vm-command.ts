import { Injectable } from '@angular/core';
import { VirtualMachineAction } from './vm-action';
import { VirtualMachine } from '../shared/vm.model';
import { Observable } from 'rxjs/Observable';


export interface IVirtualMachineCommand {
  commandName: string;
  vmStateOnAction: string;
}

@Injectable()
export abstract class VirtualMachineCommand extends VirtualMachineAction implements IVirtualMachineCommand {
  public abstract commandName: string;
  public abstract vmStateOnAction: string;

  protected onActionConfirmed(vm: VirtualMachine): Observable<any> {
    return this.addNotifications(this.vmService.command(vm, this));
  }
}
