import { Component, Input } from '@angular/core';
import { MdDialogRef } from '@angular/material';
import { VirtualMachine } from '../../shared/vm.model';
import { VmConsoleAction } from '../../vm-actions/vm-console';
import { Action } from '../../../shared/interfaces/action.interface';
import { VmCreationComponent } from "../vm-creation.component";

@Component({
  selector: 'cs-postdeployment-dialog',
  templateUrl: 'postdeployment.component.html',
})
export class PostdeploymentComponent {

  public actions: Array<Action<VirtualMachine>> = [
    this.vmConsole,
  ];

  @Input() public vm: VirtualMachine;
  @Input() public dialogRef: MdDialogRef<VmCreationComponent>;

  constructor(
    private vmConsole: VmConsoleAction,
  ) { }

  public openConsole() {
    this.dialogRef.close();

    const action = this.actions.find(_ => _.canActivate(this.vm));
    if (action) {
      action.activate(this.vm);
    }
  }
}
