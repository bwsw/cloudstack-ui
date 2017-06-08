import { Component, OnInit, Inject } from '@angular/core';
import { ConfigService } from '../../shared/services/config.service';
import { Observable } from 'rxjs/Observable';
import { TranslateService } from '@ngx-translate/core';
import { MdlDialogReference } from '../../dialog/dialog-module';
import { ServiceOffering } from '../../shared/models';
import { CustomServiceOffering } from './custom-service-offering';
import { CustomOfferingRestrictions } from './custom-offering-restrictions';


@Component({
  selector: 'cs-custom-service-offering',
  templateUrl: 'custom-service-offering.component.html',
  styleUrls: ['custom-service-offering.component.scss']
})
export class CustomServiceOfferingComponent implements OnInit {
  public restrictions: CustomOfferingRestrictions;

  constructor(
    @Inject('offering') public offering: ServiceOffering,
    @Inject('zoneId') public zoneId: string,
    public dialog: MdlDialogReference,
    private configService: ConfigService,
    private translateService: TranslateService
  ) {}

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
    this.dialog.hide(this.offering);
  }

  public onCancel(): void {
    this.dialog.hide();
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
