import { Injectable } from '@angular/core';
import { VirtualMachine, VmState, VmStates } from './vm.model';


@Injectable()
export class VmActionsCheckerService {
  public canStart(vm: VirtualMachine): boolean {
    return vm.state === VmStates.Stopped;
  }

  public canStop(vm: VirtualMachine): boolean {
    return vm.state === VmStates.Running;
  }

  public canReboot(vm: VirtualMachine): boolean {
    return vm.state === VmStates.Running;
  }

  public canRestore(vm: VirtualMachine): boolean {
    return [
      VmStates.Running,
      VmStates.Stopped
    ]
      .includes(vm.state);
  }

  public canDestroy(vm: VirtualMachine): boolean {
    return [
      VmStates.Running,
      VmStates.Stopped,
      VmStates.Error
    ]
      .includes(vm.state);
  }

  public canResetPassword(vm: VirtualMachine): boolean {
    const ipAvailable = vm.ipIsAvailable;
    const stateIsOk = [
      VmStates.Running,
      VmStates.Stopped
    ]
      .includes(vm.state);

    return ipAvailable && stateIsOk;
  }

  public canShowConsole(vm: VirtualMachine): boolean {
    return vm.state === VmStates.Running;
  }

  public canShowWebShell(vm: VirtualMachine): boolean {
    return true;
  }

  public isWebShellHidden(vm: VirtualMachine): boolean {
    return false;
  }
}
