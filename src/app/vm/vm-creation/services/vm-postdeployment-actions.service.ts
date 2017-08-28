import { Injectable } from '@angular/core';
import { ActionsService } from '../../../shared/interfaces/action-service.interface';
import { Action } from '../../../shared/interfaces/action.interface';
import { VirtualMachine } from '../../shared/vm.model';
import { VmVncConsole } from '../postdeployment-actions/vm-vnc-console';

@Injectable()
export class VmPostdeploymentActionsService
  implements ActionsService<VirtualMachine, Action<VirtualMachine>> {

  public actions: Array<Action<VirtualMachine>> = [
    this.vncConsole
  ];

  constructor(private vncConsole: VmVncConsole) {}

  public run(vm: VirtualMachine): void {
    const action = this.actions.find(_ => _.canActivate(vm));

    if (action) {
      action.activate(vm);
    }
  }
}
