import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { ICustomOfferingRestrictions } from './custom-offering-restrictions';
import { CustomServiceOffering } from './custom-service-offering';


@Component({
  selector: 'cs-custom-service-offering',
  templateUrl: 'custom-service-offering.component.html',
  styleUrls: ['custom-service-offering.component.scss']
})
export class CustomServiceOfferingComponent implements OnInit {
  public restrictions: ICustomOfferingRestrictions;
  public offering: CustomServiceOffering;
  public zoneId: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) data,
    public dialogRef: MatDialogRef<CustomServiceOfferingComponent>,
    private translateService: TranslateService
  ) {
    const { offering, restriction, zoneId } = data;
    this.offering = new CustomServiceOffering({
      cpuNumber: offering.cpuNumber,
      cpuSpeed: offering.cpuSpeed,
      memory: offering.memory,
      serviceOffering: offering
    });
    this.restrictions = restriction;
    this.zoneId = zoneId;
  }

  public ngOnInit(): void {
    if (this.zoneId == null) {
        throw new Error('Attribute \'zoneId\' is required');
    }
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
        });
    }
    if (!lowerBound && upperBound) {
      return this.translateService.get(
        'SERVICE_OFFERING.CUSTOM_SERVICE_OFFERING.UP_TO',
        {
          upperLimit
        });
    }
    if (lowerBound && !upperBound) {
      return this.translateService.get(
        'SERVICE_OFFERING.CUSTOM_SERVICE_OFFERING.FROM',
        {
          lowerLimit
        });
    }
  }

  public onSubmit(): void {
    this.dialogRef.close(this.offering);
  }
}
