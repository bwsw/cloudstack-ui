import { VirtualMachineAction, VmActions } from './vm-action';
import { VirtualMachine } from '../shared/vm.model';
import { DialogService } from '../../dialog/dialog-module/dialog.service';
import { DialogsService } from '../../dialog/dialog-service/dialog.service';
import { VmService } from '../shared/vm.service';
import { WebShellService } from '../web-shell/web-shell.service';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { JobsNotificationService } from '../../shared/services/jobs-notification.service';


@Injectable()
export class VmWebShellAction extends VirtualMachineAction {
  public action = VmActions.WEB_SHELL;
  public name = 'WEB_SHELL';
  public icon = 'computer';

  constructor(
    protected dialogService: DialogService,
    protected dialogsService: DialogsService,
    protected jobsNotificationService: JobsNotificationService,
    protected vmService: VmService,
    protected webShellService: WebShellService
  ) {
    super(dialogService, dialogsService, jobsNotificationService, vmService);
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
    return this.webShellService.isWebShellEnabledForVm(vm);
  }

  public hidden(vm: VirtualMachine): boolean {
    return !this.webShellService.isWebShellEnabled;
  }
}
