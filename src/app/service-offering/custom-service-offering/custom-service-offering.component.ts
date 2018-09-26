import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { ComputeOfferingViewModel } from '../../vm/view-models';
import { Account } from '../../shared/models';

function LimitValidator(cpuNumberLimit: number): ValidatorFn {
  return function (control: FormControl) {
    return control.value > cpuNumberLimit
      ? { cpuLimitExceeded: true }
      : null;
  };
}

@Component({
  selector: 'cs-custom-service-offering',
  templateUrl: 'custom-service-offering.component.html',
  styleUrls: ['custom-service-offering.component.scss']
})
export class CustomServiceOfferingComponent implements OnInit {
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
  }

  public ngOnInit() {
    const cpuFromOffering = this.offering.customOfferingRestrictions.cpunumber.max;
    const memoryFromOffering = this.offering.customOfferingRestrictions.memory.max;

    this.maxCpu = cpuFromOffering > this.account.cpuavailable
      ? this.account.cpuavailable : cpuFromOffering;
    this.maxMemory = memoryFromOffering > this.account.memoryavailable
      ? this.account.memoryavailable : memoryFromOffering;

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
