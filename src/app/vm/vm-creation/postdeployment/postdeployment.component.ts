import { Component, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { Store } from '@ngrx/store';
import { VirtualMachine, VmState } from '../../shared/vm.model';
import { State } from '../../../reducers/vm/redux/vm.reducers';
import { VmCreationComponent } from '../vm-creation.component';
import { HttpAccessService, SshAccessService } from '../../services';

import * as vmActions from '../../../reducers/vm/redux/vm.actions';

@Component({
  selector: 'cs-postdeployment-dialog',
  templateUrl: 'postdeployment.component.html',
  styleUrls: ['postdeployment.component.scss'],
})
export class PostdeploymentComponent {
  @Input()
  public vm: VirtualMachine;
  @Input()
  public dialogRef: MatDialogRef<VmCreationComponent>;
  @Input()
  public title: string;

  public actions: any[] = [
    {
      name: 'VM_POST_ACTION.OPEN_VNC_CONSOLE',
      hidden: vm => !vm || vm.state !== VmState.Running,
      activate: vm => this.store.dispatch(new vmActions.ConsoleVm(vm)),
    },
    {
      name: 'VM_POST_ACTION.OPEN_SHELL_CONSOLE',
      hidden: vm => {
        return (
          !vm ||
          !this.sshAccessService.isWebShellEnabled() ||
          !this.sshAccessService.isSshAuthMode(vm)
        );
      },
      activate: vm => this.store.dispatch(new vmActions.WebShellVm(vm)),
    },
    {
      name: 'VM_POST_ACTION.OPEN_URL',
      hidden: vm => !vm || !this.httpAccessService.isHttpAuthMode(vm),
      activate: vm => this.store.dispatch(new vmActions.OpenUrlVm(vm)),
    },
  ];

  constructor(
    private store: Store<State>,
    private httpAccessService: HttpAccessService,
    private sshAccessService: SshAccessService,
  ) {}

  public isHttpAuthMode(vm): boolean {
    return this.httpAccessService.isHttpAuthMode(vm);
  }

  public getUrlLogin(vm) {
    return this.httpAccessService.getLogin(vm);
  }

  public getUrlPassword(vm) {
    return this.httpAccessService.getPassword(vm);
  }
}
