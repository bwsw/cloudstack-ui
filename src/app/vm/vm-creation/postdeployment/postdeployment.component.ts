import { Component, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { Store } from '@ngrx/store';

import { getLogin, getPassword, isHttpAuthMode, VirtualMachine, VmState } from '../../shared/vm.model';
import { State } from '../../../reducers/vm/redux/vm.reducers';
import { WebShellService } from '../../web-shell/web-shell.service';
import { VmCreationComponent } from '../vm-creation.component';
import * as vmActions from '../../../reducers/vm/redux/vm.actions';

@Component({
  selector: 'cs-postdeployment-dialog',
  templateUrl: 'postdeployment.component.html',
  styleUrls: ['postdeployment.component.scss']
})
export class PostdeploymentComponent {
  @Input() public vm: VirtualMachine;
  @Input() public dialogRef: MatDialogRef<VmCreationComponent>;
  @Input() public title: string;

  public actions: any[] = [
    {
      name: 'VM_POST_ACTION.OPEN_VNC_CONSOLE',
      hidden: (vm) => !vm || vm.state !== VmState.Running,
      activate: (vm) => this.store.dispatch(new vmActions.ConsoleVm(vm))
    },
    {
      name: 'VM_POST_ACTION.OPEN_SHELL_CONSOLE',
      hidden: (vm) => {
        return !vm
          || !this.webShellService.isWebShellEnabled
          || !WebShellService.isWebShellEnabledForVm(vm);
      },
      activate: (vm) => this.store.dispatch(new vmActions.WebShellVm(vm))
    },
    {
      name: 'VM_POST_ACTION.OPEN_URL',
      hidden: (vm) => !vm || !isHttpAuthMode(vm),
      activate: (vm) => this.store.dispatch(new vmActions.OpenUrlVm(vm))
    }
  ];


  constructor(
    private store: Store<State>,
    private webShellService: WebShellService
  ) {
  }


  public isHttpAuthMode(vm): boolean {
    return isHttpAuthMode(vm);
  }

  public getUrlLogin(vm) {
    return getLogin(vm);
  }

  public getUrlPassword(vm) {
    return getPassword(vm);
  }
}
