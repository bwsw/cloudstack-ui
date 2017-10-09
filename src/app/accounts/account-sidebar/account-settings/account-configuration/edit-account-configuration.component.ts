import { Component, Inject } from '@angular/core';
import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material';

@Component({
  selector: 'cs-edit-account-configuration',
  templateUrl: 'edit-account-configuration.component.html'
})
export class EditAccountConfigurationComponent {

  public name: string;
  public value: string;
  public title: string;

  constructor(
    public dialogRef: MdDialogRef<EditAccountConfigurationComponent>,
    @Inject(MD_DIALOG_DATA) data,
  ) {
    this.name = data.configuration.name;
    this.value = data.configuration.value;
    this.title = data.title
  }

  public onConfigurationUpdate(): void {
    const newConfiguration = {
      name: this.name,
      value: this.value
    };

    this.dialogRef.close(newConfiguration);
  }

}
