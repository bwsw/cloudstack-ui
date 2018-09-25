import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { ComputeOfferingViewModel } from '../../vm/view-models';
import { Account } from '../../shared/models';

function LimitValidator(cpuNumberLimit: number): ValidatorFn {
  return function (control: FormControl) {
    if (control.value > cpuNumberLimit) {
      return { cpuLimitExceeded: true };
    } else {
      return null;
    }
  };
}

@Component({
  selector: 'cs-custom-service-offering',
  templateUrl: 'custom-service-offering.component.html',
  styleUrls: ['custom-service-offering.component.scss']
})
export class CustomServiceOfferingComponent {
  public offering: ComputeOfferingViewModel;
  public hardwareForm: FormGroup;
  public account: Account;
  public maxCpu: number;
  public maxMemory: number;

  constructor(
    @Inject(MAT_DIALOG_DATA) data,
    public dialogRef: MatDialogRef<CustomServiceOfferingComponent>,
  ) {
    this.offering = data.offering;
    this.account = data.account;
    if (this.offering.customOfferingRestrictions.cpunumber.max > this.account.cpuavailable) {
      this.maxCpu = this.account.cpuavailable
    } else {
      this.maxCpu = this.offering.customOfferingRestrictions.cpunumber.max;
    }

    if (this.offering.customOfferingRestrictions.memory.max > this.account.memoryavailable) {
      this.maxMemory = this.account.memoryavailable;
    } else {
      this.maxMemory = this.offering.customOfferingRestrictions.memory.max;
    }

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
    this.hardwareForm = new FormGroup({
      cpuNumber: new FormControl(this.offering.cpunumber, [Validators.required, LimitValidator(this.maxCpu)]),
      cpuSpeed: new FormControl(this.offering.cpuspeed, [Validators.required]),
      memory: new FormControl(this.offering.memory, [Validators.required, LimitValidator(this.maxMemory)]),
    });
  }
}
