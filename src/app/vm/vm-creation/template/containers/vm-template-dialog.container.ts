import { Store } from '@ngrx/store';
import { State } from '../../../../reducers/index';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { BaseTemplateModel } from '../../../../template/shared/base-template.model';

@Component({
  selector: 'cs-vm-creation-template-dialog-container',
  template: `
    <cs-vm-creation-template-dialog
      [preselectedTemplate]="preselectedTemplate"
      (close)="onClose($event)"
    ></cs-vm-creation-template-dialog>`
})
export class VmTemplateDialogContainerComponent {
  public zoneId: string;
  public preselectedTemplate: BaseTemplateModel;

  constructor(
    private dialogRef: MatDialogRef<VmTemplateDialogContainerComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.zoneId = data.zoneId;
    this.preselectedTemplate = data.template;
  }


  public onClose(template: BaseTemplateModel) {
    this.dialogRef.close(template);
  }
}
