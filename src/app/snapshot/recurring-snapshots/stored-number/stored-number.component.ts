import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';


@Component({
  selector: 'cs-stored-number',
  templateUrl: 'stored-number.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => StoredNumberComponent),
      multi: true
    }
  ]
})
export class StoredNumberComponent implements ControlValueAccessor {
  public _storedNumber: number;

  public minValue = 1;
  public maxValue = 8; // investigate if this is configurable

  constructor(private translateService: TranslateService) {}

  public get errorMessage(): Observable<string> {
    return this.translateService.get('BETWEEN', {
      lowerLimit: this.minValue,
      upperLimit: this.maxValue
    });
  }

  public propagateChange: any = () => {};

  @Input()
  public get storedNumber(): number {
    return this._storedNumber;
  }

  public set storedNumber(value) {
    this._storedNumber = value;
    this.propagateChange(this.storedNumber);
  }

  public registerOnChange(fn): void {
    this.propagateChange = fn;
  }

  public registerOnTouched(): void { }

  public writeValue(value: any): void {
    if (value) {
      this.storedNumber = value;
    }
  }
}
