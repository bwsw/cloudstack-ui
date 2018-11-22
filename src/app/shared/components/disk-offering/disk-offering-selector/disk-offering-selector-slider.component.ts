import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DiskOffering } from '../../../models/index';

@Component({
  selector: 'cs-disk-offering-selector-slider',
  templateUrl: 'disk-offering-selector-slider.component.html',
})
export class DiskOfferingSelectorSliderComponent {
  @Input()
  public min: number;
  @Input()
  public max: number;
  @Input()
  public newSize: number;
  @Input()
  public diskOffering: DiskOffering;
  @Output()
  public changedOffering = new EventEmitter<DiskOffering>();

  public changeOffering(disksize: number) {
    const newDiskOffering = { ...this.diskOffering, disksize };
    this.changedOffering.emit(newDiskOffering);
  }
}
