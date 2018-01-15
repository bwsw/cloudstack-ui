import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  forwardRef,
  Input,
  Output
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { ServiceOffering } from '../../shared/models/service-offering.model';
// tslint:disable-next-line
import { VmCreationServiceOfferingContainerComponent } from '../../vm/vm-creation/service-offering/vm-creation-service-offering.container';
import { ICustomOfferingRestrictions } from '../custom-service-offering/custom-offering-restrictions';


@Component({
  selector: 'cs-service-offering-selector',
  templateUrl: 'service-offering-selector.component.html',
  styleUrls: ['service-offering-selector.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ServiceOfferingSelectorComponent),
      multi: true
    }
  ]
})
export class ServiceOfferingSelectorComponent {
  @Input() public customOfferingRestrictions: ICustomOfferingRestrictions;
  @Input() public serviceOfferings: Array<ServiceOffering>;
  @Output() public change: EventEmitter<ServiceOffering>;

  private _serviceOffering: ServiceOffering;
  private previousOffering: ServiceOffering;

  constructor(
    private cd: ChangeDetectorRef,
    private dialog: MatDialog,
    private translateService: TranslateService
  ) {
    this.change = new EventEmitter();
  }

  public registerOnChange(fn): void {
    this.propagateChange = fn;
  }

  public registerOnTouched(): void {
  }

  public propagateChange: any = () => {
  };

  public writeValue(serviceOffering: ServiceOffering): void {
    if (serviceOffering) {
      this.serviceOffering = serviceOffering;
    }
  }

  @Input()
  public get serviceOffering(): ServiceOffering {
    return this._serviceOffering;
  }

  public set serviceOffering(serviceOffering: ServiceOffering) {
    this._serviceOffering = serviceOffering;
    this.propagateChange(this.serviceOffering);
  }

  public onClick() {
    this.dialog.open(VmCreationServiceOfferingContainerComponent, <MatDialogConfig>{
      width: '700px',
      disableClose: true,
      data: {
        serviceOffering: this.serviceOffering,
        restriction: this.customOfferingRestrictions
      }
    })
      .afterClosed()
      .filter(res => Boolean(res))
      .subscribe(offering => {
        this.serviceOffering = offering;
        this.change.next(this.serviceOffering);
      });
  }

  public get offeringName(): Observable<string> {
    if (!this.serviceOffering) {
      return Observable.of('');
    }

    return this.translateService.get([
      'UNITS.MB',
      'UNITS.MHZ',
      'VM_PAGE.VM_CREATION.SERVICE_OFFERING'
    ])
      .map(translations => {
        if (!this.serviceOffering.iscustomized) {
          return `${translations['VM_PAGE.VM_CREATION.SERVICE_OFFERING']}: ${this.serviceOffering.name}`;
        } else {
          const cpuNumber = this.serviceOffering.cpunumber;
          const cpuSpeed = this.serviceOffering.cpuspeed;
          const memory = this.serviceOffering.memory;
          return `${translations['VM_PAGE.VM_CREATION.SERVICE_OFFERING']}: ${this.serviceOffering.name} - ` +
            `${cpuNumber}x${cpuSpeed} ${translations['UNITS.MHZ']}, ${memory} ${translations['UNITS.MB']}`;
        }
      });
  }
}
