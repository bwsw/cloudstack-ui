import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'cs-search',
  templateUrl: 'search.component.html',
  styleUrls: ['search.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SearchComponent),
      multi: true,
    },
  ],
})
export class SearchComponent implements ControlValueAccessor {
  // tslint:disable-next-line:variable-name
  public _query: string;

  public propagateChange: any = () => {};

  @Input()
  public get query(): string {
    return this._query;
  }

  public set query(value: string) {
    this._query = value;
    this.propagateChange(this.query);
  }

  public writeValue(value: string): void {
    if (value) {
      this.query = value;
    }
  }

  public registerOnChange(fn): void {
    this.propagateChange = fn;
  }

  public registerOnTouched(): void {}
}
