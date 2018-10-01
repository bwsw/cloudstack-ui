import {
  Component,
  Inject
} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef
} from '@angular/material';
import { VirtualMachine } from '../../shared/vm.model';
import * as vmActions from '../../../reducers/vm/redux/vm.actions';
import { State } from '../../../reducers/index';
import { Store } from '@ngrx/store';
import { HttpAccessService, SshAccessService } from '../../services/index';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'cs-vm-access-dialog',
  templateUrl: 'vm-access.component.html',
  styleUrls: ['vm-access.component.scss']
})
export class VmAccessComponent {
  public vm: VirtualMachine;
  public title = 'VM_PAGE.COMMANDS.VM_ACCESS';
  public tabIndex = 0;

  public actions: any[] = [
    {
      name: 'VM_POST_ACTION.VNC_CONSOLE',
      actionName: 'VM_POST_ACTION.OPEN_VNC_CONSOLE',
      available: (vm) => vm,
      activate: (vm) => this.store.dispatch(new vmActions.ConsoleVm(vm))
    },
    {
      name: 'VM_POST_ACTION.SHELL_CONSOLE',
      actionName: 'VM_POST_ACTION.OPEN_SHELL_CONSOLE',
      available: (vm) => {
        return vm && this.sshAccessService.isWebShellEnabledForVm(vm);
      },
      activate: (vm) => this.store.dispatch(new vmActions.WebShellVm(vm))
    },
    {
      name: 'VM_POST_ACTION.URL',
      actionName: 'VM_POST_ACTION.OPEN_URL',
      available: (vm) => vm && this.httpAccessService.isHttpAuthMode(vm),
      activate: (vm) => this.store.dispatch(new vmActions.OpenUrlVm(vm))
    }
  ];

  constructor(
    public dialogRef: MatDialogRef<VmAccessComponent>,
    private store: Store<State>,
    private httpAccessService: HttpAccessService,
    private sshAccessService: SshAccessService,
    private translateService: TranslateService,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.vm = data;
  }

  public isWebShellEnabled(): boolean {
    return this.sshAccessService.isWebShellEnabled();
  }

  public getUrlLogin(vm: VirtualMachine): string {
    return this.httpAccessService.getHttpLogin(vm)
      || this.translateService.instant('VM_POST_ACTION.NOT_SET');
  }

  public getUrlPassword(vm: VirtualMachine): string {
    return this.httpAccessService.getHttpPassword(vm)
      || this.translateService.instant('VM_POST_ACTION.NOT_SET');
  }

  public getSSHPort(vm: VirtualMachine): string {
    return this.sshAccessService.getPort(vm);
  }

  public getSSHLogin(vm: VirtualMachine): string {
    return this.sshAccessService.getLogin(vm);
  }

  public getSSHPassword(vm: VirtualMachine): string {
    return this.sshAccessService.getPassword(vm)
      || this.translateService.instant('VM_POST_ACTION.NOT_SET');
  }

  public getConnectionString(vm: VirtualMachine): string {
    return `ssh -p ${this.getSSHPort(vm)} -u ${this.getSSHLogin(vm)} ${vm.nic[0].ipaddress}`;
  }
}
