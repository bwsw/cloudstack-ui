import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatSelectChange } from '@angular/material';
import { DiskOffering } from '../../models/disk-offering.model';


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
  @Input() public placeholder: string;
  @Input() public required = false;
  @Input() public selectedDiskOfferingId: string;
  @Output() public change: EventEmitter<DiskOffering>;

  private _diskOffering: DiskOffering;

  constructor() {
    this.change = new EventEmitter();
  }

  public updateDiskOffering(change: MatSelectChange): void {
    const diskOffering = change.value as DiskOffering;
    if (diskOffering) {
      this._diskOffering = diskOffering;
      this.change.next(this._diskOffering);
    }
  }

  public get diskOffering(): DiskOffering {
    return this.diskOfferingList.find(_ => _.id === this.selectedDiskOfferingId) || this.diskOfferingList[0];
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
