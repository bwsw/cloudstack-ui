import { VirtualMachineAction, VmActions } from './vm-action';
import { VirtualMachine } from '../shared/vm.model';
import { DialogService } from '../../dialog/dialog-module/dialog.service';
import { VmService } from '../shared/vm.service';
import { WebShellService } from '../web-shell/web-shell.service';
import { Observable } from 'rxjs/Observable';


export class VmWebShellAction extends VirtualMachineAction {
  public action = VmActions.WEB_SHELL;
  public name = 'WEB_SHELL';
  public icon = 'computer';

  constructor(
    public vm: VirtualMachine,
    protected dialogService: DialogService,
    protected vmService: VmService,
    protected webShellService: WebShellService
  ) {
    super(vm, dialogService, vmService);
  }

  public activate(): Observable<void> {
    const address = this.webShellService.getWebShellAddress(this.vm);
    window.open(address);
    return Observable.of(null);
  }

  public canActivate(): boolean {
    return this.webShellService.isWebShellEnabled(this.vm);
  }
}
