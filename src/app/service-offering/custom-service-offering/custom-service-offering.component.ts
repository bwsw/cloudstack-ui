import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { ICustomOfferingRestrictions } from '../../shared/models';
import { CustomServiceOffering } from './custom-service-offering';

@Component({
  selector: 'cs-custom-service-offering',
  templateUrl: 'custom-service-offering.component.html',
  styleUrls: ['custom-service-offering.component.scss']
})
export class CustomServiceOfferingComponent {
  public restrictions: ICustomOfferingRestrictions;
  public offering: CustomServiceOffering;

  constructor(
    @Inject(MAT_DIALOG_DATA) data,
    public dialogRef: MatDialogRef<CustomServiceOfferingComponent>,
    private translateService: TranslateService
  ) {
    const { offering, restriction, defaultParams } = data;
    this.offering = {
      ...offering,
      cpunumber: offering.cpunumber || defaultParams.cpunumber,
      cpuspeed: offering.cpuspeed || defaultParams.cpuspeed,
      memory: offering.memory || defaultParams.memory
    };
    this.restrictions = restriction;
  }

  public errorMessage(lowerLimit: any, upperLimit: any): Observable<string> {
    const upperBound = Number.isInteger(upperLimit);
    const lowerBound = Number.isInteger(lowerLimit);

    if (lowerBound && upperBound) {
      return this.translateService.get(
        'SERVICE_OFFERING.CUSTOM_SERVICE_OFFERING.BETWEEN',
        {
          lowerLimit,
          upperLimit
        }
      );
    }
    if (!lowerBound && upperBound) {
      return this.translateService.get(
        'SERVICE_OFFERING.CUSTOM_SERVICE_OFFERING.UP_TO',
        {
          upperLimit
        }
      );
    }
    if (lowerBound && !upperBound) {
      return this.translateService.get(
        'SERVICE_OFFERING.CUSTOM_SERVICE_OFFERING.FROM',
        {
          lowerLimit
        }
      );
    }
  }

  public onSubmit(): void {
    this.dialogRef.close(this.offering);
  }
}
