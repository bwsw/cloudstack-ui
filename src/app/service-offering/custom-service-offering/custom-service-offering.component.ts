import { Component, OnInit } from '@angular/core';
import { MdlDialogReference } from 'angular2-mdl';
import { ConfigService } from '../../shared/services/config.service';


class CustomServiceOffering {
  constructor(
    public cpuNumber: number,
    public cpuSpeed: number,
    public memory: number
  ) {}
}

interface CustomOfferingRestrictions {
  cpuNumber: {
    min: number;
    max: number;
  },
  cpuSpeed: {
    min: number;
    max: number;
  },
  memory: {
    min: number;
    max: number;
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
  public zoneId = "3fcdb37c-1c0b-4728-b62f-970c765c3fbc";

  constructor(
    public dialog: MdlDialogReference,
    private configService: ConfigService
  ) {}

  public ngOnInit(): void {
    debugger;
    this.configService.get('customOfferingRestrictions')
      .subscribe((restrictions: CustomOfferingRestrictions) => {
        this.restrictions = restrictions[this.zoneId];
        this.offering = new CustomServiceOffering(
          this.restrictions.cpuNumber.min,
          this.restrictions.cpuSpeed.min,
          this.restrictions.memory.min
        );
      });
  }

  public onSubmit(): void {
    this.dialog.hide(this.restrictions);
  }

  public onCancel(): void {
    this.dialog.hide();
  }
}
