import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { ServiceOfferingFilterService } from '../shared/services/service-offering-filter.service';
import { ServiceOffering } from '../shared/models/service-offering.model';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';


@Component({
  selector: 'cs-service-offering-selector',
  templateUrl: './service-offering-selector.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ServiceOfferingSelectorComponent),
      multi: true
    }
  ]
})
export class ServiceOfferingSelectorComponent implements ControlValueAccessor, OnInit {
  public serviceOfferings: Array<ServiceOffering>;
  private _serviceOffering: string;

  constructor(private serviceOfferingFilterService: ServiceOfferingFilterService) {}

  public propagateChange: any = () => {};

  @Input() public get serviceOffering() {
    return this._serviceOffering;
  }

  public set serviceOffering(value) {
    this._serviceOffering = value;
    this.propagateChange(value);
  }

  public writeValue(value) {
    if (value) {
      this.serviceOffering = value;
    }
  }

  public registerOnChange(fn) {
    this.propagateChange = fn;
  }

  public registerOnTouched() { }

  public ngOnInit(): void {
    this.serviceOfferingFilterService.getAvailable().subscribe(availableOfferings => {
      this.serviceOfferings = availableOfferings;
      if (this.serviceOfferings.length) {
        this.serviceOffering = this.serviceOfferings[0].id;
      }
    });
  }
}
