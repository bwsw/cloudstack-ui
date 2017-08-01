import { Injectable } from '@angular/core';
import { VmActionBuilderService } from '../vm-actions/vm-action-builder.service';
import { VirtualMachineAction } from '../vm-actions/vm-action';
import { VirtualMachine } from './vm.model';


@Injectable()
export class VmActionsService {
  constructor(private vmActionBuilderService: VmActionBuilderService) {}

  public getActions(vm: VirtualMachine): Array<VirtualMachineAction> {
    return [
      this.vmActionBuilderService.getStartAction(vm),
      this.vmActionBuilderService.getStopAction(vm),
      this.vmActionBuilderService.getRebootAction(vm),
      this.vmActionBuilderService.getRestoreAction(vm),
      this.vmActionBuilderService.getDestroyAction(vm),
      this.vmActionBuilderService.getResetPasswordAction(vm),
      this.vmActionBuilderService.getConsoleAction(vm),
      this.vmActionBuilderService.getWebShellAction(vm)
    ];
  }
}
