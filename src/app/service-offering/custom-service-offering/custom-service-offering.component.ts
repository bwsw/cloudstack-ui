import { Component, OnInit, Inject } from '@angular/core';
import { MdlDialogReference } from 'angular2-mdl';
import { ConfigService } from '../../shared/services/config.service';
import { Observable } from 'rxjs';
import { TranslateService } from 'ng2-translate';


export class CustomServiceOffering {
  constructor(
    public cpuNumber: number,
    public cpuSpeed: number,
    public memory: number
  ) {}
}

interface CustomOfferingRestriction {
  min: number;
  max: number;
}

class CustomOfferingRestrictions {
  public cpuNumber: CustomOfferingRestriction;
  public cpuSpeed: CustomOfferingRestriction;
  public memory: CustomOfferingRestriction;

  constructor(restrictions: any) {
    this.cpuNumber = {
      min: 0,
      max: Number.POSITIVE_INFINITY
    };

    this.cpuSpeed = {
      min: 0,
      max: Number.POSITIVE_INFINITY
    };

    this.memory = {
      min: 0,
      max: Number.POSITIVE_INFINITY
    };

    if (!restrictions) {
      return;
    }

    if (restrictions.cpuNumber && restrictions.cpuNumber.min) {
      this.cpuNumber.min = restrictions.cpuNumber.min;
    }
    if (restrictions.cpuNumber && restrictions.cpuNumber.max) {
      this.cpuNumber.max = restrictions.cpuNumber.max;
    }
    if (restrictions.cpuSpeed && restrictions.cpuSpeed.min) {
      this.cpuSpeed.min = restrictions.cpuSpeed.min;
    }
    if (restrictions.cpuSpeed && restrictions.cpuSpeed.max) {
      this.cpuSpeed.max = restrictions.cpuSpeed.max;
    }
    if (restrictions.memory && restrictions.memory.min) {
      this.memory.min = restrictions.memory.min;
    }
    if (restrictions.memory && restrictions.memory.max) {
      this.memory.max = restrictions.memory.max;
    }
  }
}

@Component({
  selector: 'cs-custom-service-offering',
  templateUrl: 'custom-service-offering.component.html',
  styleUrls: ['custom-service-offering.component.scss']
})
export class CustomServiceOfferingComponent implements OnInit {
  public offering: CustomServiceOffering;
  public restrictions: CustomOfferingRestrictions;

  constructor(
    @Inject('offering') public preexistingOffering: CustomServiceOffering,
    @Inject('zoneId') public zoneId: string,
    public dialog: MdlDialogReference,
    private configService: ConfigService,
    private translateService: TranslateService
  ) {}

  public ngOnInit(): void {
    if (this.zoneId == null) {
      throw new Error('Attribute \'zoneId\' is required');
    }

    this.configService.get('customOfferingRestrictions')
      .subscribe((restrictions: CustomOfferingRestrictions) => {
        try {
          this.restrictions = new CustomOfferingRestrictions(restrictions[this.zoneId]);
        } catch (e) {
          throw new Error('Custom offering settings must be specified. Contact your administrator.');
        }
        this.offering = new CustomServiceOffering(
          this.restrictions.cpuNumber.min,
          this.restrictions.cpuSpeed.min,
          this.restrictions.memory.min
        );
      });

    if (this.preexistingOffering) {
      this.offering = this.preexistingOffering;
    }
  }

  public errorMessage(lowerLimit: any, upperLimit: any): Observable<string> {
    if (Number.isInteger(lowerLimit) && Number.isInteger(upperLimit)) {
      return this.translateService.get('BETWEEN', { lowerLimit, upperLimit });
    }
    if (!Number.isInteger(lowerLimit) && Number.isInteger(upperLimit)) {
      return this.translateService.get('UP_TO', { upperLimit });
    }
    if (Number.isInteger(lowerLimit) && !Number.isInteger(upperLimit)) {
      return this.translateService.get('FROM', { lowerLimit });
    }
    if (Number.isNaN(lowerLimit) && !Number.isInteger(upperLimit)) {
      return this.translateService.get('INCORRECT_FORMAT');
    }
  }

  public onSubmit(): void {
    this.dialog.hide(this.offering);
  }

  public onCancel(): void {
    this.dialog.hide();
  }
}
