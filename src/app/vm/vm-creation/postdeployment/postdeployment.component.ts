import { Component, Inject } from '@angular/core';
import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material';
import { VirtualMachine } from '../../shared/vm.model';
import { VmConsoleAction } from '../../vm-actions/vm-console';
import { Action } from '../../../shared/interfaces/action.interface';
import { VmWebShellAction } from '../../vm-actions/vm-webshell';

interface PostDeploymentAction {
  action: Action<VirtualMachine>;
  key: string;
}

@Component({
  selector: 'cs-postdeployment-dialog',
  templateUrl: 'postdeployment.component.html',
})
export class PostdeploymentComponent {
  public vm: VirtualMachine;

  public actions: PostDeploymentAction[] = [
    { key: 'VM_POST_ACTION.OPEN_VNC_CONSOLE', action: this.vmConsole },
    { key: 'VM_POST_ACTION.OPEN_SHELL_CONSOLE', action: this.vmWebShellConsole }
  ];

  constructor(
    public dialogRef: MdDialogRef<PostdeploymentComponent>,
    private vmConsole: VmConsoleAction,
    private vmWebShellConsole: VmWebShellAction,
    @Inject(MD_DIALOG_DATA) data
  ) {
    this.vm = data.vm;
  }

}