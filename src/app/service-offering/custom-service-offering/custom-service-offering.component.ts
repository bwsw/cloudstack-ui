import { Component, Inject, OnInit } from '@angular/core';
import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { ServiceOffering } from '../../shared/models';
import { ConfigService } from '../../shared/services/config.service';
import { CustomOfferingRestrictions } from './custom-offering-restrictions';
import { CustomServiceOffering } from './custom-service-offering';


@Component({
  selector: 'cs-custom-service-offering',
  templateUrl: 'custom-service-offering.component.html',
  styleUrls: ['custom-service-offering.component.scss']
})
export class CustomServiceOfferingComponent implements OnInit {
  public restrictions: CustomOfferingRestrictions;
  public offering: ServiceOffering;
  public zoneId: string;

  constructor(
    @Inject(MD_DIALOG_DATA) data,
    public dialogRef: MdDialogRef<CustomServiceOfferingComponent>,
    private configService: ConfigService,
    private translateService: TranslateService
  ) {
    this.offering = data.offering;
    this.zoneId = data.zoneId;
  }

  public ngOnInit(): void {
    if (this.zoneId == null) { throw new Error('Attribute \'zoneId\' is required'); }
    this.loadCustomOfferingRestrictions().subscribe(() => {
      this.initOffering();
    });
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

  private loadCustomOfferingRestrictions(): Observable<void> {
    return this.configService.get('customOfferingRestrictions')
      .map(restrictions => {
        try {
          this.restrictions = new CustomOfferingRestrictions(restrictions[this.zoneId]);
        } catch (e) {
          throw new Error('Custom offering settings must be specified. Contact your administrator.');
        }
      });
  }

  private initOffering(): void {
    this.offering = new CustomServiceOffering({
      cpuNumber: this.restrictions.cpuNumber.min,
      cpuSpeed: this.restrictions.cpuSpeed.min,
      memory: this.restrictions.memory.min,
      serviceOffering: this.offering
    });
  }
}
