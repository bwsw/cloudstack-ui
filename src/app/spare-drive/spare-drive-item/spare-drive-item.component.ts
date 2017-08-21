import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MdMenuTrigger } from '@angular/material';
import { DiskOffering, Volume } from '../../shared/models';
import { DiskOfferingService } from '../../shared/services/disk-offering.service';
import { ZoneService } from '../../shared/services/zone.service';
import { SpareDriveActionsService } from '../spare-drive-actions.service';
import { SpareDriveItem } from '../spare-drive-item';


@Component({
  selector: 'cs-spare-drive-item',
  templateUrl: 'spare-drive-item.component.html',
  styleUrls: ['spare-drive-item.component.scss']
})
export class SpareDriveItemComponent extends SpareDriveItem implements OnInit {
  @Input() public isSelected: (volume) => boolean;
  @Input() public item: Volume;
  @Output() public onClick = new EventEmitter();
  @ViewChild(MdMenuTrigger) public mdMenuTrigger: MdMenuTrigger;

  public diskOfferings: Array<DiskOffering>;

  constructor(
    public spareDriveActionsService: SpareDriveActionsService,
    protected diskOfferingService: DiskOfferingService,
    protected zoneService: ZoneService
  ) {
    super(diskOfferingService, zoneService);
  }

  public ngOnInit(): void {
    this.loadDiskOfferings();
  }

  public handleClick(e: MouseEvent): void {
    e.stopPropagation();
    if (!this.mdMenuTrigger.menuOpen) {
      this.onClick.emit(this.item);
    }
  }
}
