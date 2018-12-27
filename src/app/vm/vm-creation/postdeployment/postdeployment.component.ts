import { Component, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { Store } from '@ngrx/store';
import { VirtualMachine, VmState } from '../../shared/vm.model';
import { State } from '../../../reducers/vm/redux/vm.reducers';
import { VmCreationComponent } from '../vm-creation.component';

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

  constructor(private store: Store<State>) {}

  public isVmRunning(vm: VirtualMachine): boolean {
    return vm.state === VmState.Running;
  }

  public accessVm() {
    this.store.dispatch(new vmActions.AccessVm(this.vm));
    this.dialogRef.close();
  }
}
