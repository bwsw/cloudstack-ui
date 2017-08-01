import { Injectable } from '@angular/core';
import { VirtualMachine } from '../shared/vm.model';
import { DialogService } from '../../dialog/dialog-module/dialog.service';
import { VmService } from '../shared/vm.service';
import { VmStartAction } from './vm-start';
import { VmStopAction } from './vm-stop';
import { VmRebootAction } from './vm-reboot';
import { VmRestoreAction } from './vm-restore';
import { VmEntityDeletionService } from '../shared/vm-entity-deletion.service';
import { VmDestroyAction } from './vm-destroy';
import { VmWebShellAction } from './vm-webshell';
import { VmResetPasswordAction } from './vm-reset-password';
import { VmConsoleAction } from './vm-console';
import { WebShellService } from '../web-shell/web-shell.service';


@Injectable()
export class VmActionBuilderService {
  constructor(
    private dialogService: DialogService,
    private vmEntityDeletionService: VmEntityDeletionService,
    private vmService: VmService,
    private webShellService: WebShellService
  ) {}

  public getStartAction(vm: VirtualMachine): VmStartAction {
    return new VmStartAction(vm, this.dialogService, this.vmService);
  }

  public getStopAction(vm: VirtualMachine): VmStopAction {
    return new VmStopAction(vm, this.dialogService, this.vmService);
  }

  public getRebootAction(vm: VirtualMachine): VmRebootAction {
    return new VmRebootAction(vm, this.dialogService, this.vmService);
  }

  public getRestoreAction(vm: VirtualMachine): VmRestoreAction {
    return new VmRestoreAction(vm, this.dialogService, this.vmService);
  }

  public getDestroyAction(vm: VirtualMachine): VmDestroyAction {
    return new VmDestroyAction(
      vm,
      this.dialogService,
      this.vmService,
      this.vmEntityDeletionService
    );
  }

  public getResetPasswordAction(vm: VirtualMachine): VmResetPasswordAction {
    return new VmResetPasswordAction(
      vm,
      this.dialogService,
      this.vmService,
      this
    );
  }

  public getConsoleAction(vm: VirtualMachine): VmConsoleAction {
    return new VmConsoleAction(vm, this.dialogService, this.vmService);
  }

  public getWebShellAction(vm: VirtualMachine): VmWebShellAction {
    return new VmWebShellAction(
      vm,
      this.dialogService,
      this.vmService,
      this.webShellService
    );
  }
}
