import { Component, EventEmitter, Output, Input } from '@angular/core';
import { DiskOffering } from '../..';


@Component({
  selector: 'cs-disk-offering',
  templateUrl: 'disk-offering.component.html',
  styleUrls: ['disk-offering.component.scss']
})
export class DiskOfferingComponent {
  @Input() public diskOfferingList: Array<DiskOffering>;
  @Output() public offeringUpdated = new EventEmitter();

  public selectedDiskOffering: DiskOffering;

  public ngOnInit(): void {
    if (!this.diskOfferingList) {
      throw new Error('diskOfferingList is a required parameter');
    }

    if (this.diskOfferingList.length) {
      this.selectedDiskOffering = this.diskOfferingList[0];
    }
  }

  public updateDiskOffering(offering): void {
    this.offeringUpdated.emit(offering);
  }
}
