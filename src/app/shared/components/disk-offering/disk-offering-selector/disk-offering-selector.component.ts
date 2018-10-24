import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { DiskOffering } from '../../../models/index';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { DiskOfferingDialogComponent } from '../disk-offering-dialog/disk-offering-dialog.component';
import { AuthService } from '../../../services/auth.service';

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
export class DiskOfferingSelectorComponent implements ControlValueAccessor, OnChanges {
  @Input()
  public diskOfferings: DiskOffering[];
  @Input()
  public required: boolean;
  @Input()
  public account: Account;
  @Input()
  public isShowSlider = false;
  @Input()
  public isShowSelector = true;
  @Input()
  public min: number;
  @Input()
  public newSize: number;
  @Input()
  public storageAvailable: string;
  @Output()
  public change = new EventEmitter();
  @Output()
  public changeSize = new EventEmitter<number>();
  public max: number;
  // tslint:disable-next-line
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

  constructor(
    private cd: ChangeDetectorRef,
    private authService: AuthService,
    private dialog: MatDialog,
  ) {
    this.change = new EventEmitter();
    this.setMaxSizeValue();
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (changes.storageAvailable && changes.storageAvailable.currentValue) {
      this.setMaxSizeValue();
    }
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
          storageAvailable: this.storageAvailable,
        },
      })
      .afterClosed()
      .subscribe((offering: DiskOffering) => {
        if (offering) {
          this.diskOffering = offering;
          this.change.next(offering);
        }
      });
  }

  private setMaxSizeValue() {
    const customDiskOfferingMaxSize = this.authService.getCustomDiskOfferingMaxSize();
    this.min = this.min ? this.min : this.authService.getCustomDiskOfferingMinSize();
    if (isNaN(Number(this.storageAvailable))) {
      this.max = customDiskOfferingMaxSize;
    } else {
      this.max = Math.min(customDiskOfferingMaxSize, Number(this.storageAvailable));
    }
  }
}
