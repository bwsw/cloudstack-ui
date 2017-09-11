import { Component, Inject } from '@angular/core';
import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material';
import { VirtualMachine } from '../../shared/vm.model';
import { VmConsoleAction } from '../../vm-actions/vm-console';
import { Action } from '../../../shared/interfaces/action.interface';

@Component({
  selector: 'cs-postdeployment-dialog',
  templateUrl: 'postdeployment.component.html',
})
export class PostdeploymentComponent {
  public vm: VirtualMachine;

  public actions: Array<Action<VirtualMachine>> = [
    this.vmConsole,
  ];

  constructor(
    public dialogRef: MdDialogRef<PostdeploymentComponent>,
    private vmConsole: VmConsoleAction,
    @Inject(MD_DIALOG_DATA) data
  ) {
    this.vm = data.vm;
  }

  public openConsole() {
    this.dialogRef.close();

    const action = this.actions.find(_ => _.canActivate(this.vm));
    if (action) {
      action.activate(this.vm);
    }
  }

}