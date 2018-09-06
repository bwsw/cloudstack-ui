import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { ComputeOfferingViewModel } from '../../vm/view-models';
import { HardwareParameterLimits } from '../../shared/models';

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

  public getDefaultCpuNumber() {
    const defaultValue = this.offering.defaultValues.cpunumber;
    const restrictions = this.offering.restrictions.cpunumber;

    return this.getValueThatSatisfiesRestrictions(defaultValue, restrictions);
  }

  public getDefaultCpuSpeed() {
    const defaultValue = this.offering.defaultValues.cpuspeed;
    const restrictions = this.offering.restrictions.cpuspeed;

    return this.getValueThatSatisfiesRestrictions(defaultValue, restrictions);
  }

  public getDefaultMemory() {
    const defaultValue = this.offering.defaultValues.memory;
    const restrictions = this.offering.restrictions.memory;

    return this.getValueThatSatisfiesRestrictions(defaultValue, restrictions);
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
      cpuNumber: new FormControl(this.getDefaultCpuNumber(), Validators.required),
      cpuSpeed: new FormControl(this.getDefaultCpuSpeed(), Validators.required),
      memory: new FormControl(this.getDefaultMemory(), Validators.required),
    });
  }

  private getValueThatSatisfiesRestrictions(defaultValue: number, restrictions: HardwareParameterLimits) {
    if (restrictions.min > defaultValue) {
      return restrictions.min;
    } else if (defaultValue > restrictions.max) {
      return restrictions.max;
    }

    return defaultValue;
  }
}
