import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ICustomOfferingRestrictions } from './custom-offering-restrictions';
import { CustomServiceOffering } from './custom-service-offering';
import { FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { integerValidator } from '../../shared/directives/integer-validator';

@Component({
  selector: 'cs-custom-service-offering',
  templateUrl: 'custom-service-offering.component.html',
  styleUrls: ['custom-service-offering.component.scss']
})
export class CustomServiceOfferingComponent {
  public restrictions: ICustomOfferingRestrictions;
  public offering: CustomServiceOffering;
  public customOfferingForm: FormGroup;
  public validatorMessages = {
    'required': 'SERVICE_OFFERING.CUSTOM_SERVICE_OFFERING.REQUIRED',
    'min': 'SERVICE_OFFERING.CUSTOM_SERVICE_OFFERING.FROM',
    'max': 'SERVICE_OFFERING.CUSTOM_SERVICE_OFFERING.UP_TO',
    'between': 'SERVICE_OFFERING.CUSTOM_SERVICE_OFFERING.BETWEEN',
    'integerValidator': 'SERVICE_OFFERING.CUSTOM_SERVICE_OFFERING.INTEGER',
  };
  private cpuNumberValidators: ValidatorFn[] = [
    Validators.required,
    integerValidator()
  ];
  private cpuSpeedValidators: ValidatorFn[] = [
    Validators.required,
    integerValidator()
  ];
  private memoryValidators: ValidatorFn[] = [
    Validators.required,
    integerValidator()
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) data,
    public dialogRef: MatDialogRef<CustomServiceOfferingComponent>
  ) {
    const { offering, restriction, defaultParams } = data;
    this.offering = {
      ...offering,
      cpunumber: offering.cpunumber || defaultParams.cpunumber,
      cpuspeed: offering.cpuspeed || defaultParams.cpuspeed,
      memory: offering.memory || defaultParams.memory
    };
    this.restrictions = restriction;
    if (this.restrictions.cpunumber.min !== null) {
      this.cpuNumberValidators.push(Validators.min(this.restrictions.cpunumber.min));
    }
    if (this.restrictions.cpunumber.max !== null) {
      this.cpuNumberValidators.push(Validators.max(this.restrictions.cpunumber.max));
    }
    if (this.restrictions.cpuspeed.min !== null) {
      this.cpuSpeedValidators.push(Validators.min(this.restrictions.cpuspeed.min));
    }
    if (this.restrictions.cpuspeed.max !== null) {
      this.cpuSpeedValidators.push(Validators.max(this.restrictions.cpuspeed.max));
    }
    if (this.restrictions.memory.min !== null) {
      this.memoryValidators.push(Validators.min(this.restrictions.memory.min));
    }
    if (this.restrictions.memory.max !== null) {
      this.memoryValidators.push(Validators.max(this.restrictions.memory.max));
    }

    this.customOfferingForm = new FormGroup({
      cpunumber: new FormControl(this.offering.cpunumber, this.cpuNumberValidators),
      cpuspeed: new FormControl(this.offering.cpuspeed, this.cpuSpeedValidators),
      memory: new FormControl(this.offering.memory, this.memoryValidators)
    });
  }

  public onSubmit(): void {
    this.offering = {
      ...this.offering,
      cpunumber: +this.customOfferingForm.value.cpunumber,
      cpuspeed: +this.customOfferingForm.value.cpuspeed,
      memory: +this.customOfferingForm.value.memory,
    } as CustomServiceOffering;
    this.dialogRef.close(this.offering);
  }
}
