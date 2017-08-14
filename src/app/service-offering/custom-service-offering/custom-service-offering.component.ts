import { Component, Inject, OnInit } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { TranslateService } from '@ngx-translate/core';
import { ServiceOffering } from '../../shared/models';
import { ICustomOfferingRestrictions } from './custom-offering-restrictions';


@Component({
  selector: 'cs-custom-service-offering',
  templateUrl: 'custom-service-offering.component.html',
  styleUrls: ['custom-service-offering.component.scss']
})
export class CustomServiceOfferingComponent implements OnInit {
  public restrictions: ICustomOfferingRestrictions;
  public offering: ServiceOffering;
  public zoneId: string;

  constructor(
    @Inject(MD_DIALOG_DATA) data,
    public dialogRef: MdDialogRef<CustomServiceOfferingComponent>,
    private translateService: TranslateService
  ) {
    this.offering = data.offering;
    this.restrictions = data.restriction;
    this.zoneId = data.zoneId;
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
      return this.translateService.get('BETWEEN', { lowerLimit, upperLimit });
    }
    if (!lowerBound && upperBound) {
      return this.translateService.get('UP_TO', { upperLimit });
    }
    if (lowerBound && !upperBound) {
      return this.translateService.get('FROM', { lowerLimit });
    }
  }

  public onSubmit(): void {
    this.dialogRef.close(this.offering);
  }

  public onCancel(): void {
    this.dialogRef.close();
  }
}
