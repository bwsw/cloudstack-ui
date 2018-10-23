import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { DiskOffering } from '../../../models/index';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { DiskOfferingDialogComponent } from '../disk-offering-dialog/disk-offering-dialog.component';

@Component({
  selector: 'cs-disk-offering-selector',
  templateUrl: 'disk-offering-selector.component.html',
  styleUrls: ['disk-offering-selector.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DiskOfferingSelectorComponent),
      multi: true,
    },
  ],
})
export class DiskOfferingSelectorComponent implements ControlValueAccessor {
  @Input()
  public diskOfferings: DiskOffering[];
  @Input()
  public required: boolean;
  @Output()
  public changed: EventEmitter<DiskOffering>;
  // tslint:disable-next-line:variable-name
  private _diskOffering: DiskOffering;

  @Input()
  public get diskOffering(): DiskOffering {
    return this._diskOffering;
  }

  public set diskOffering(value: DiskOffering) {
    if (value) {
      this._diskOffering = value;
      this.propagateChange(this.diskOffering);
    }
  }

  constructor(private dialog: MatDialog) {
    this.changed = new EventEmitter();
  }

  public registerOnChange(fn): void {
    this.propagateChange = fn;
  }

  public registerOnTouched(): void {}

  public propagateChange: any = () => {};

  public writeValue(diskOffering: DiskOffering): void {
    if (diskOffering) {
      this._diskOffering = diskOffering;
    }
  }

  public changeOffering(): void {
    this.dialog
      .open(DiskOfferingDialogComponent, {
        width: '750px',
        data: {
          diskOfferings: this.diskOfferings,
          diskOffering: this._diskOffering,
        },
      })
      .afterClosed()
      .subscribe((offering: DiskOffering) => {
        if (offering) {
          this.diskOffering = offering;
          this.changed.next(offering);
        }
      });
  }
}
