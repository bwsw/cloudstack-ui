import { Injectable } from '@angular/core';
import { ActionsService } from '../../../shared/interfaces/action-service.interface';
import { Action } from '../../../shared/interfaces/action.interface';
import { VirtualMachine } from '../../shared/vm.model';
import { VmVncConsoleAction } from '../postdeployment-actions/vm-vnc-console';
import { VmShowPasswordAction } from '../postdeployment-actions/vm-show-password';

@Injectable()
export class VmPostdeploymentActionsService
  implements ActionsService<VirtualMachine, Action<VirtualMachine>> {

  public actions: Array<Action<VirtualMachine>> = [
    this.vncConsole,
    this.vmPassword
  ];

  constructor(
    private vncConsole: VmVncConsoleAction,
    private vmPassword: VmShowPasswordAction
  ) {
  }

  public run(vm: VirtualMachine): void {
    const action = this.actions.find(_ => _.canActivate(vm));

    if (action) {
      action.activate(vm);
    }
  }
}
