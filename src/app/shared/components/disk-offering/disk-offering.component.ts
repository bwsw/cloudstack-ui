import { Component, EventEmitter, Output, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DiskOffering, DiskOfferingService } from '../..';

@Component({
  selector: 'cs-disk-offering',
  templateUrl: 'disk-offering.component.html',
  styleUrls: ['disk-offering.component.scss']
})
export class DiskOfferingComponent implements OnChanges {
  @Input() public zoneId: string;
  @Output() public offeringUpdated = new EventEmitter();
  public diskOfferingList: Array<DiskOffering>;

  public selectedDiskOffering: DiskOffering;

  constructor(private diskOfferingService: DiskOfferingService) { }

  public updateDiskOffering(offering): void {
    this.offeringUpdated.emit(offering);
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (!changes['zoneId']) {
      return;
    }
    this.diskOfferingService.getList({ zoneId: this.zoneId })
      .subscribe((result: Array<DiskOffering>) => {
        if (result.length) {
          this.diskOfferingList = result;
          this.selectedDiskOffering = result[0];
          this.updateDiskOffering(this.selectedDiskOffering);
        }
      });
  }
}
