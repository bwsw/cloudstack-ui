import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { DiskOffering } from '../../../models/index';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'cs-disk-offering-selector',
  templateUrl: 'disk-offering-selector.component.html',
})
export class DiskOfferingSelectorComponent implements OnChanges, OnInit {
  @Input()
  public diskOfferings: DiskOffering[];
  @Input()
  public required: boolean;
  @Input()
  public account: Account;
  @Input()
  public enableSlider = false;
  @Input()
  public enableSelector = true;
  @Input()
  public min: number;
  @Input()
  public newSize: number;
  @Input()
  public availableStorage: number | 'Unlimited';
  @Input()
  public diskOffering: DiskOffering;

  @Output()
  public changed = new EventEmitter();

  public max: number;

  constructor(private authService: AuthService) {}

  public ngOnInit() {
    this.setMaxSizeValue();
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (changes.availableStorage && changes.availableStorage.currentValue) {
      this.setMaxSizeValue();
    }
  }

  public changedOffering(offering): void {
    const disksize = offering.disksize === 0 ? this.min : offering.disksize;
    const newOffering = { ...offering, disksize };
    this.changed.next(newOffering);
  }

  private setMaxSizeValue(): void {
    // todo: create selector
    this.min = this.min ? this.min : this.authService.getCustomDiskOfferingMinSize();
    this.max = this.getMaxSizeValue();
    this.newSize = this.newSize === 0 ? this.min : this.newSize;
  }

  private getMaxSizeValue() {
    // todo: create selector
    const customDiskOfferingMaxSize = this.authService.getCustomDiskOfferingMaxSize();
    /** if availableStorage value is Unlimited then the get max value from capabilities
     * else compare available
     */

    if (this.availableStorage === 'Unlimited') {
      // if Unlimited then choose customDiskOfferingMaxSize
      // because we don't have other restrictions on max size
      return customDiskOfferingMaxSize;
    }

    if (this.availableStorage === 0) {
      // can't go lower than min.
      // todo: test that it works in all cases
      return this.min;
    }

    if (this.availableStorage) {
      // math min of two because we need to take the most strict
      // limit of the two
      return Math.min(customDiskOfferingMaxSize, Number(this.availableStorage));
    }
  }
}
