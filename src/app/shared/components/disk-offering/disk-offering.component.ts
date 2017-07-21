import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { MdSelectChange } from '@angular/material';
import { DiskOffering } from '../..';


@Component({
  selector: 'cs-disk-offering',
  templateUrl: 'disk-offering.component.html',
  styleUrls: ['disk-offering.component.scss']
})
export class DiskOfferingComponent implements OnInit, OnChanges {
  @Input() public diskOfferingList: Array<DiskOffering>;
  @Output() public offeringUpdated = new EventEmitter();

  public selectedDiskOffering: DiskOffering;

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

  public updateDiskOffering(change: MdSelectChange): void {
    this.offeringUpdated.emit(change.value);
  }

  private updateSelectedOffering(): void {
    if (this.diskOfferingList.length) {
      this.selectedDiskOffering = this.diskOfferingList[0];
    }
  }
}
