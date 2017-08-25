import { Component, Input, OnInit } from '@angular/core';
import { Volume } from '../../../shared/models/volume.model';
import { SpareDriveActionsService } from '../../spare-drive-actions.service';
import { SpareDriveAction } from '../spare-drive-action';
import { DiskOfferingService } from '../../../shared/services/disk-offering.service';
import { DiskOffering } from '../../../shared/models/disk-offering.model';


@Component({
  selector: 'cs-spare-drive-actions',
  templateUrl: 'spare-drive-actions.component.html'
})
export class SpareDriveActionsComponent implements OnInit {
  @Input() public volume: Volume;
  public diskOfferings: Array<DiskOffering>;

  constructor(
    public spareDriveActionsService: SpareDriveActionsService,
    private diskOfferingService: DiskOfferingService
  ) {}

  public ngOnInit(): void {
    this.diskOfferingService.getList()
      .subscribe(diskOfferings => this.diskOfferings = diskOfferings);
  }

  public onAction(action: SpareDriveAction, volume: Volume): void {
    action.activate(volume, { diskOfferings: this.diskOfferings }).subscribe();
  }
}
