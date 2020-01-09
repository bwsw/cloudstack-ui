import { Component, HostListener } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { VmStopParams } from '../vm.service';

@Component({
  selector: 'cs-vm-stop-dialog',
  templateUrl: './vm-stop-dialog.component.html',
  styleUrls: ['./vm-stop-dialog.component.scss'],
})
export class VmStopDialogComponent {
  public forced = false;

  constructor(private dialogRef: MatDialogRef<VmStopDialogComponent, VmStopParams>) {}

  public confirmStop() {
    this.dialogRef.close({ forced: this.forced });
  }

  @HostListener('keydown.esc')
  public onEsc(): void {
    this.dialogRef.close();
  }
}
