import { VmActions } from './vm-action';
import { VirtualMachine } from '../shared/vm.model';
import { WebShellService } from '../web-shell/web-shell.service';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';

@Injectable()
export class VmWebShellAction  {
  public action = VmActions.WEB_SHELL;
  public name = 'VM_PAGE.COMMANDS.WEB_SHELL';
  public icon = 'computer';

  constructor(
    protected webShellService: WebShellService
  ) {
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
}
