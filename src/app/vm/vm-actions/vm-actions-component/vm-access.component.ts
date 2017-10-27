import {
  Component,
  Inject
} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef
} from '@angular/material';
import { VirtualMachine } from '../../shared/vm.model';


@Component({
  selector: 'cs-vm-access-dialog',
  templateUrl: 'vm-access.component.html'
})
export class VmAccessComponent {
  public vm: VirtualMachine;
  public title = 'VM_PAGE.COMMANDS.VM_ACCESS';

  constructor(
    public dialogRef: MatDialogRef<VmAccessComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.vm = data;
  }
}
