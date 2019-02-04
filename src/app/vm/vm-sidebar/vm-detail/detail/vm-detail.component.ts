import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material';

import { VirtualMachine } from '../../../shared/vm.model';
import { VmUserDataDialogComponent } from '../vm-user-data-dialog/vm-user-data-dialog.component';

@Component({
  selector: 'cs-vm-detail',
  templateUrl: 'vm-detail.component.html',
  styleUrls: ['vm-detail.component.scss'],
})
export class VmDetailComponent {
  @Input()
  public vm: VirtualMachine;

  constructor(private dialog: MatDialog) {}

  public viewUserData(): void {
    this.dialog.open(VmUserDataDialogComponent, {
      width: '400px',
      data: this.vm,
    });
  }
}
