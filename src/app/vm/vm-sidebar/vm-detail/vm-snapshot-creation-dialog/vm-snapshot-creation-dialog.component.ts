import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'cs-vm-snapshot-creation-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './vm-snapshot-creation-dialog.component.html',
  styleUrls: ['./vm-snapshot-creation-dialog.component.scss'],
})
export class VmSnapshotCreationDialogComponent {
  public form: FormGroup = new FormGroup({
    name: new FormControl(undefined),
    description: new FormControl(undefined),
    snapshotMemory: new FormControl({ value: true, disabled: true }),
  });

  constructor(private dialogRef: MatDialogRef<VmSnapshotCreationDialogComponent>) {}

  public onSubmit() {
    this.dialogRef.close(this.form.getRawValue());
  }

  public onClose() {
    this.dialogRef.close();
  }

  public getNameControl(): AbstractControl | null {
    return this.form.get('name');
  }

  public getDescriptionControl(): AbstractControl | null {
    return this.form.get('description');
  }
}
