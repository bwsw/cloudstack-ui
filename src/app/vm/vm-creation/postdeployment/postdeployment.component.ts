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
import { VmSavePasswordAction } from '../../vm-actions/vm-save-password';
import { UserTagService } from '../../../shared/services/tags/user-tag.service';

interface PostDeploymentAction {
  action: Action<VirtualMachine>;
  key: string;
}


@Component({
  selector: 'cs-postdeployment-dialog',
  templateUrl: 'postdeployment.component.html',
  styleUrls: ['postdeployment.component.scss']
})
export class PostdeploymentComponent {

  public actions: PostDeploymentAction[] = [
    { key: 'VM_POST_ACTION.OPEN_VNC_CONSOLE', action: this.vmConsole },
    { key: 'VM_POST_ACTION.OPEN_SHELL_CONSOLE', action: this.vmWebShellConsole },
    { key: 'VM_POST_ACTION.OPEN_URL', action: this.vmURL}
  ];

  @Input() public vm: VirtualMachine;
  @Input() public dialogRef: MdDialogRef<VmCreationComponent>;

  public canSavePassword: boolean;
  public disableButton: boolean = false;

  constructor(
    private vmConsole: VmConsoleAction,
    private vmWebShellConsole: VmWebShellAction,
    private vmSavePassword: VmSavePasswordAction,
    private vmURL: VmURLAction,
    private userTagService: UserTagService
  ) {
    this.userTagService.getSavePasswordForAllVms().subscribe(tag => {
      this.canSavePassword = !tag;
    });
  }

  public isHttpAuthMode(vm): boolean {
    return this.vmURL.canActivate(vm);
  }

  public getLogin(vm) {
    return this.vmURL.getLogin(vm);
  }

  public getPassword(vm) {
    return this.vmURL.getPassword(vm);
  }

  public savePassword() {
    this.disableButton = true;
    this.vmSavePassword.activate(this.vm, { key: 'csui.vm.password', value: this.vm.password }).subscribe(() => {
      this.canSavePassword = false;
    });
  }

}
