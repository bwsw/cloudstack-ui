import { Component, Inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { TranslateService } from '@ngx-translate/core';
import { MdlDialogReference } from '../../dialog/dialog-module';
import { ServiceOffering } from '../../shared/models';
import { ICustomOfferingRestrictions } from './custom-offering-restrictions';


@Component({
  selector: 'cs-custom-service-offering',
  templateUrl: 'custom-service-offering.component.html',
  styleUrls: ['custom-service-offering.component.scss']
})
export class CustomServiceOfferingComponent implements OnInit {
  constructor(
    @Inject('offering') public offering: ServiceOffering,
    @Inject('restrictions') public restrictions: ICustomOfferingRestrictions,
    @Inject('zoneId') public zoneId: string,
    public dialog: MdlDialogReference,
    private translateService: TranslateService
  ) {}

  public ngOnInit(): void {
    if (this.zoneId == null) { throw new Error('Attribute \'zoneId\' is required'); }
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
    this.dialog.hide(this.offering);
  }

  public onCancel(): void {
    this.dialog.hide();
  }
}
