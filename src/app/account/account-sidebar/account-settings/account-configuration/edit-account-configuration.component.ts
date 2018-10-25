import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'cs-edit-account-configuration',
  templateUrl: 'edit-account-configuration.component.html',
})
export class EditAccountConfigurationComponent {
  public name: string;
  public value: string;
  public title: string;

  constructor(
    private dialogRef: MatDialogRef<EditAccountConfigurationComponent>,
    @Inject(MAT_DIALOG_DATA) data,
  ) {
    this.name = data.configuration.name;
    this.value = data.configuration.value;
    this.title = data.title;
  }

  public onConfigurationUpdate(): void {
    const newConfiguration = {
      name: this.name,
      value: this.value,
    };

    this.dialogRef.close(newConfiguration);
  }

  public close() {
    this.dialogRef.close();
  }
}
