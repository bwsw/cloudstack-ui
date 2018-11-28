import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Volume } from '../../models';

@Component({
  selector: 'cs-volume-snapshot-from-vm-snapshot-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './volume-snapshot-from-vm-snapshot-dialog.component.html',
  styleUrls: ['./volume-snapshot-from-vm-snapshot-dialog.component.scss'],
})
export class VolumeSnapshotFromVmSnapshotDialogComponent {
  public volumes: Volume[];
  public form: FormGroup = new FormGroup({
    name: new FormControl(undefined),
    volumeId: new FormControl(undefined, Validators.required),
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) data: any,
    private dialogRef: MatDialogRef<VolumeSnapshotFromVmSnapshotDialogComponent>,
  ) {
    this.volumes = data.volumes;
  }

  public onSubmit() {
    this.dialogRef.close(this.form.value);
  }

  public onClose() {
    this.dialogRef.close();
  }
}
