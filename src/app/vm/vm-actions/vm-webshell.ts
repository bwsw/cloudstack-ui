import { VirtualMachineAction, VmActions } from './vm-action';
import { VirtualMachine } from '../shared/vm.model';
import { DialogService } from '../../dialog/dialog-module/dialog.service';
import { VmService } from '../shared/vm.service';
import { WebShellService } from '../web-shell/web-shell.service';
import { Observable } from 'rxjs/Observable';
import { AfterViewInit } from '@angular/core';


export class VmWebShellAction extends VirtualMachineAction {
  public action = VmActions.WEB_SHELL;
  public name = 'WEB_SHELL';
  public icon = 'computer';

  constructor(
    protected dialogService: DialogService,
    protected vmService: VmService,
    protected webShellService: WebShellService
  ) {
    super(dialogService, vmService);
  }

  public activate(vm: VirtualMachine): Observable<void> {
    const address = this.webShellService.getWebShellAddress(vm);
    window.open(address);
    return Observable.of(null);
  }

  public canActivate(vm: VirtualMachine): boolean {
    return this.webShellService.isWebShellEnabled(vm);
  }

  public hidden(vm: VirtualMachine): boolean {
    // todo: change to extensions
    return !this.webShellService.isWebShellAddressSpecified;
  }
}
