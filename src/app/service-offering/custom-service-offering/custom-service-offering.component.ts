import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { ComputeOfferingViewModel } from '../../vm/view-models';

@Component({
  selector: 'cs-custom-service-offering',
  templateUrl: 'custom-service-offering.component.html',
  styleUrls: ['custom-service-offering.component.scss']
})
export class CustomServiceOfferingComponent {
  public offering: ComputeOfferingViewModel;
  public hardwareForm: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) data,
    public dialogRef: MatDialogRef<CustomServiceOfferingComponent>,
  ) {
    const { offering } = data;
    this.offering = offering;

    this.createForm();
  }

  public onSubmit(): void {
    const formModel = this.hardwareForm.value;
    const updatedOffering: ComputeOfferingViewModel = {
      ...this.offering,
      cpunumber: formModel.cpuNumber,
      cpuspeed: formModel.cpuSpeed,
      memory: formModel.memory
    };
    this.dialogRef.close(updatedOffering);
  }

  private createForm() {
    // input text=number provide all other validation for current restrictions
    this.hardwareForm = new FormGroup({
      cpuNumber: new FormControl(this.offering.cpunumber, Validators.required),
      cpuSpeed: new FormControl(this.offering.cpuspeed, Validators.required),
      memory: new FormControl(this.offering.memory, Validators.required),
    });
  }
}
