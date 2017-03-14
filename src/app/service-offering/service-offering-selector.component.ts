import { Component, Input, forwardRef, SimpleChanges, OnChanges } from '@angular/core';
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
export class ServiceOfferingSelectorComponent implements ControlValueAccessor, OnChanges {
  @Input() public serviceOfferings: Array<ServiceOffering>;
  private _serviceOffering: string;

  public propagateChange: any = () => {};

  @Input() public get serviceOffering(): string {
    return this._serviceOffering;
  }

  public set serviceOffering(value) {
    this._serviceOffering = value;
    this.propagateChange(value);
  }

  public writeValue(value): void {
    if (value) {
      this.serviceOffering = value;
    }
  }

  public registerOnChange(fn): void {
    this.propagateChange = fn;
  }

  public registerOnTouched(): void { }

  public ngOnChanges(changes: SimpleChanges): void {
    if ('serviceOfferings' in changes) {
      const offerings = changes['serviceOfferings'].currentValue;
      if (!offerings) {
        return;
      }
      if (offerings.length) {
        this.serviceOffering = offerings[0].id;
      } else {
        this.serviceOffering = null;
      }
    }
  }
}
