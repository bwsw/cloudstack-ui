import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { DiskOffering, DiskOfferingService } from '../..';

@Component({
  selector: 'cs-disk-offering',
  templateUrl: 'disk-offering.component.html',
  styleUrls: ['disk-offering.component.scss']
})
export class DiskOfferingComponent implements OnInit {
  @Output() public offeringUpdated = new EventEmitter();
  public diskOfferingList: Array<DiskOffering>;

  public selectedDiskOffering: DiskOffering;

  constructor(private diskOfferingService: DiskOfferingService) { }

  public updateDiskOffering(offering): void {
    this.offeringUpdated.emit(offering);
  }

  public ngOnInit(): void {
    this.diskOfferingService.getList()
      .subscribe(result => {
        this.diskOfferingList = result;
        this.selectedDiskOffering = result[0];
        this.updateDiskOffering(this.selectedDiskOffering);
      });
  }
}
