import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { ComputeOfferingViewModel } from '../../vm/view-models';
import { Account } from '../../shared/models';

@Component({
  selector: 'cs-custom-service-offering',
  templateUrl: 'custom-service-offering.component.html',
  styleUrls: ['custom-service-offering.component.scss'],
})
export class CustomServiceOfferingComponent implements OnInit {
  public offering: ComputeOfferingViewModel;
  public hardwareForm: FormGroup;
  public account: Account;

  constructor(
    @Inject(MAT_DIALOG_DATA) data,
    public dialogRef: MatDialogRef<CustomServiceOfferingComponent>,
  ) {
    this.offering = data.offering;
    this.account = data.account;
  }

  public ngOnInit() {
    this.createForm();
  }

  public onSubmit(): void {
    const formModel = this.hardwareForm.value;
    const updatedOffering: ComputeOfferingViewModel = {
      ...this.offering,
      cpunumber: formModel.cpuNumber,
      cpuspeed: formModel.cpuSpeed,
      memory: formModel.memory,
    };
    this.dialogRef.close(updatedOffering);
  }

  private createForm() {
    // input text=number provide all other validation for current restrictions
    this.hardwareForm = new FormGroup({
      cpuNumber: new FormControl(
        { value: this.offering.cpunumber, disabled: !this.offering.isAvailableByResources },
        Validators.required,
      ),
      cpuSpeed: new FormControl(
        { value: this.offering.cpuspeed, disabled: !this.offering.isAvailableByResources },
        Validators.required,
      ),
      memory: new FormControl(
        { value: this.offering.memory, disabled: !this.offering.isAvailableByResources },
        Validators.required,
      ),
    });
  }
}
