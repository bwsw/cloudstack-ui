import { Component, Input, OnInit } from '@angular/core';
import { DiskOffering } from '../../../models/disk-offering.model';
import { Volume } from '../../../models/volume.model';
import { DiskOfferingService } from '../../../services/disk-offering.service';
import { VolumeActionsService } from '../volume-actions.service';
import { VolumeAction } from '../volume-action';


@Component({
  selector: 'cs-volume-actions',
  templateUrl: 'volume-actions.component.html'
})
export class VolumeActionsComponent implements OnInit {
  @Input() public volume: Volume;
  public diskOfferings: Array<DiskOffering>;

  constructor(
    public volumeActionsService: VolumeActionsService,
    private diskOfferingService: DiskOfferingService
  ) {}

  public ngOnInit(): void {
    this.diskOfferingService.getList()
      .subscribe(diskOfferings => this.diskOfferings = diskOfferings);
  }

  public onAction(action: VolumeAction, volume: Volume): void {
    action.activate(volume, { diskOfferings: this.diskOfferings }).subscribe();
  }
}
