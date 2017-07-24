import { Component, Input, SimpleChanges, OnChanges, OnInit, forwardRef, Output, EventEmitter } from '@angular/core';
import { DiskOffering } from '../..';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';


@Component({
  selector: 'cs-disk-offering',
  templateUrl: 'disk-offering.component.html',
  styleUrls: ['disk-offering.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DiskOfferingComponent),
      multi: true
    }
  ]
})
export class DiskOfferingComponent implements ControlValueAccessor {
  @Input() public diskOfferingList: Array<DiskOffering>;
  @Output() public change: EventEmitter<DiskOffering>;

  private _diskOffering: DiskOffering;

  constructor() {
    this.change = new EventEmitter();
  }

  public updateDiskOffering(diskOffering: DiskOffering): void {
    if (diskOffering) {
      this.diskOffering = diskOffering;
      this.change.next(this.diskOffering);
    }
  }

  @Input()
  public get diskOffering(): DiskOffering {
    return this._diskOffering;
  }

  public set diskOffering(diskOffering: DiskOffering) {
    if (diskOffering) {
      this._diskOffering = diskOffering;
      this.propagateChange(this.diskOffering);
    }
  }

  public writeValue(diskOffering: DiskOffering): void {
    if (diskOffering) {
      this.diskOffering = diskOffering;
    }
  }

  public propagateChange: any = () => {};
  public registerOnTouched(): any {}

  public registerOnChange(fn): void {
    this.propagateChange = fn;
  }
}
