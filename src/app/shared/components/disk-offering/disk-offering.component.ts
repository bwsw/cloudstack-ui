import { Component, Input, SimpleChanges, OnChanges, OnInit, forwardRef } from '@angular/core';
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
export class DiskOfferingComponent implements OnInit, OnChanges, ControlValueAccessor {
  @Input() public diskOfferingList: Array<DiskOffering>;

  private _diskOffering: DiskOffering;

  public ngOnInit(): void {
    if (!this.diskOfferingList) {
      throw new Error('diskOfferingList is a required parameter');
    }
    this.updateSelectedOffering();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if ('diskOfferingList' in changes) {
      this.updateSelectedOffering();
    }
  }

  public updateDiskOffering(diskOffering: DiskOffering): void {
    if (diskOffering) {
      this.diskOffering = diskOffering;
    }
  }

  @Input()
  public get diskOffering(): DiskOffering {
    return this._diskOffering;
  }

  public set diskOffering(diskOffering: DiskOffering) {
    this._diskOffering = diskOffering;
    this.propagateChange(this.diskOffering);
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

  private updateSelectedOffering(): void {
    if (this.diskOfferingList.length) {
      this.diskOffering = this.diskOfferingList[0];
    }
  }
}
