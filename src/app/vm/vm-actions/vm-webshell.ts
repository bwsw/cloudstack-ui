import { VirtualMachineAction, VmActions } from './vm-action';
import { VirtualMachine } from '../shared/vm.model';
import { DialogService } from '../../dialog/dialog-service/dialog.service';
import { VmService } from '../shared/vm.service';
import { WebShellService } from '../web-shell/web-shell.service';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { JobsNotificationService } from '../../shared/services/jobs-notification.service';


@Injectable()
export class VmWebShellAction extends VirtualMachineAction {
  public action = VmActions.WEB_SHELL;
  public name = 'VM_PAGE.COMMANDS.WEB_SHELL';
  public icon = 'computer';

  constructor(
    protected dialogService: DialogService,
    protected jobsNotificationService: JobsNotificationService,
    protected vmService: VmService,
    protected webShellService: WebShellService
  ) {
    super(dialogService, jobsNotificationService, vmService);
  }

  public activate(vm: VirtualMachine): Observable<void> {
    const address = this.webShellService.getWebShellAddress(vm);
    window.open(
      address,
      vm.displayName,
      'resizable=0,width=820,height=640'
    );
    return Observable.of(null);
  }

  public canActivate(vm: VirtualMachine): boolean {
    if (!vm) {
      return false;
    }

    return this.webShellService.isWebShellEnabledForVm(vm);
  }

  public hidden(vm: VirtualMachine): boolean {
    return !this.webShellService.isWebShellEnabled;
  }
}
