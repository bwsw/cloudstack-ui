import { Component, Inject } from '@angular/core';
import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material';

@Component({
  selector: 'cs-edit-account-configuration',
  templateUrl: 'edit-account-configuration.component.html'
})
export class EditAccountConfigurationComponent {

  public name: string;
  public value: string;

  constructor(
    public dialogRef: MdDialogRef<EditAccountConfigurationComponent>,
    @Inject(MD_DIALOG_DATA) data,
  ) {
    this.name = data.configuration.name;
    this.value = data.configuration.value;
  }

  public onConfigurationUpdate(): void {
    const newConfiguration = {
      name: this.name,
      value: this.value
    };

    this.dialogRef.close(newConfiguration);
  }

  /*
  command=updateConfiguration&accountid=44efce88-8677-46c4-9931-20eafbdebd00
  &response=json
  &name=use.system.public.ips
  &value=true
  &_=1506911974417

  * */


}
