import { ChangeDetectorRef, Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
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
      multi: true
    }
  ]
})
export class DiskOfferingSelectorComponent implements ControlValueAccessor {
  @Input() public diskOfferings: Array<DiskOffering>;
  @Input() public required: boolean;
  @Input() public params: Array<string>;
  @Output() public change: EventEmitter<DiskOffering>;
  public diskOffering: DiskOffering;
  private _diskOfferingId: string;

  @Input()
  public get diskOfferingId(): string {
    return this._diskOfferingId;
  }

  constructor(
    private cd: ChangeDetectorRef,
    private dialog: MatDialog) {
    this.change = new EventEmitter();
  }

  public registerOnChange(fn): void {
    this.propagateChange = fn;
  }

  public registerOnTouched(): void {
  }

  public propagateChange: any = () => {
  };

  public writeValue(diskOfferingId: string): void {
    if (diskOfferingId) {
      this.diskOffering = this.diskOfferings.find(_ => _.id === diskOfferingId);
    }
  }

  public changeOffering(): void {
    this.dialog.open(DiskOfferingDialogComponent, {
      width: '910px',
      data: {
        diskOfferings: this.diskOfferings,
        diskOffering: this.diskOffering,
        columns: this.params
      }
    })
      .afterClosed()
      .subscribe((offering: DiskOffering) => {
        if (offering) {
          this.diskOffering = offering;
          this.change.next(offering);
        }
      });
  }
}
