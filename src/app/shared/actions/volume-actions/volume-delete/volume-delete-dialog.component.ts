import { Component, HostListener, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'cs-volume-delete-dialog',
  templateUrl: './volume-delete-dialog.component.html',
  styleUrls: ['./volume-delete-dialog.component.scss'],
})
export class VolumeDeleteDialogComponent {
  public deleteSnapshots = false;

  constructor(
    public dialogRef: MatDialogRef<VolumeDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public hasSnapshots: boolean,
  ) {}

  public confirmDestroy(): void {
    const result: { deleteSnapshots?: boolean } = {};
    if (this.deleteSnapshots) {
      result.deleteSnapshots = true;
    }
    this.dialogRef.close(result);
  }

  @HostListener('keydown.esc')
  public onEsc(): void {
    this.dialogRef.close();
  }
}
