import {
  Component,
  Input
} from '@angular/core';
import { MdDialogRef } from '@angular/material';
import { VirtualMachine } from '../../shared/vm.model';
import { VmCreationComponent } from '../vm-creation.component';
import { Action } from '../../../shared/interfaces/action.interface';
import { VmConsoleAction } from '../../vm-actions/vm-console';
import { VmWebShellAction } from '../../vm-actions/vm-webshell';
import { VmURLAction } from '../../vm-actions/vm-url';

interface PostDeploymentAction {
  action: Action<VirtualMachine>;
  key: string;
}


@Component({
  selector: 'cs-postdeployment-dialog',
  templateUrl: 'postdeployment.component.html',
})
export class PostdeploymentComponent {

  public actions: PostDeploymentAction[] = [
    { key: 'VM_POST_ACTION.OPEN_VNC_CONSOLE', action: this.vmConsole },
    { key: 'VM_POST_ACTION.OPEN_SHELL_CONSOLE', action: this.vmWebShellConsole },
    { key: 'VM_POST_ACTION.OPEN_URL', action: this.vmURL}
  ];

  @Input() public vm: VirtualMachine;
  @Input() public dialogRef: MdDialogRef<VmCreationComponent>;
  @Input() public title: string;

  private passwordToken = 'csui.vm.password';

  constructor(
    private vmConsole: VmConsoleAction,
    private vmWebShellConsole: VmWebShellAction,
    private vmURL: VmURLAction
  ) { }

  public getPassword() {
    const passwordTag = this.vm.tags.find(tag => tag.key === this.passwordToken);
    return this.vm.password || passwordTag && passwordTag.value;
  }

  public isHttpAuthMode(vm): boolean {
    return this.vmURL.canActivate(vm);
  }

  public getUrlLogin(vm) {
    return this.vmURL.getLogin(vm);
  }

  public getUrlPassword(vm) {
    return this.vmURL.getPassword(vm);
  }
}
