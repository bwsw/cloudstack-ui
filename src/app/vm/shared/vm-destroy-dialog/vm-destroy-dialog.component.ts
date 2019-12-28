import { Component, HostListener, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { VirtualMachine } from '../vm.model';

export interface VmDestroyDialogData {
  vm: VirtualMachine;
  canExpungeOrRecoverVm: boolean;
}

@Component({
  selector: 'cs-vm-destroy-dialog',
  templateUrl: './vm-destroy-dialog.component.html',
  styleUrls: ['./vm-destroy-dialog.component.scss'],
})
export class VmDestroyDialogComponent {
  public readonly vmIdSlice: string;

  public expunge = false;

  public get canExpunge() {
    return this.dialogData.canExpungeOrRecoverVm;
  }

  constructor(
    public dialogRef: MatDialogRef<VmDestroyDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private dialogData: VmDestroyDialogData,
  ) {
    this.vmIdSlice = dialogData.vm.id.slice(0, 4);
  }

  public confirmDestroy(): void {
    const result = {};
    if (this.expunge) {
      result['expunge'] = true;
    }
    this.dialogRef.close(result);
  }

  @HostListener('keydown.esc')
  public onEsc(): void {
    this.dialogRef.close();
  }
}
