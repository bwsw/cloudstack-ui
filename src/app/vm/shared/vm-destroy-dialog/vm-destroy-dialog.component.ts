import { Component, HostListener, Inject } from '@angular/core';
import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material';

@Component({
  selector: 'cs-vm-destroy-dialog',
  templateUrl: './vm-destroy-dialog.component.html',
  styleUrls: ['./vm-destroy-dialog.component.scss']
})
export class VmDestroyDialogComponent {
  public expunge = false;

  constructor(
    public dialogRef: MdDialogRef<VmDestroyDialogComponent>,
    @Inject(MD_DIALOG_DATA) public canExpunge: boolean
  ) { }

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
