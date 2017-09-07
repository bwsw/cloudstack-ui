import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MdMenuTrigger } from '@angular/material';
import { SpareDriveActionsService } from '../../shared/actions/spare-drive-actions/spare-drive-actions.service';
import { DiskOffering, Volume } from '../../shared/models';
import { VolumeType } from '../../shared/models/volume.model';
import { DiskOfferingService } from '../../shared/services/disk-offering.service';
import { ZoneService } from '../../shared/services/zone.service';
import { SpareDriveItem } from '../spare-drive-item';


@Component({
  selector: 'cs-spare-drive-item',
  templateUrl: 'spare-drive-item.component.html',
  styleUrls: ['spare-drive-item.component.scss']
})
export class SpareDriveItemComponent extends SpareDriveItem implements OnInit, OnChanges {
  @Input() public isSelected: (volume) => boolean;
  @Input() public searchQuery: () => string;
  @Input() public item: Volume;
  @Output() public onClick = new EventEmitter();
  @ViewChild(MdMenuTrigger) public mdMenuTrigger: MdMenuTrigger;

  public diskOfferings: Array<DiskOffering>;
  public query: string;

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

  public ngOnChanges(changes: SimpleChanges): void {
    const query = changes.searchQuery;
    if (query) {
      this.query = this.searchQuery();
    }
  }

  public get diskType(): string {
    if (this.item.type === VolumeType.ROOT) {
      return 'VOLUME_TYPE.ROOT';
    }
  }

  public get descriptionIncludesQuery(): boolean {
    return this.query && this.item.description.includes(this.query);
  }

  public get stateTranslationToken(): string {
    const stateTranslations = {
      'ALLOCATED': 'SPARE_DRIVE_STATE.ALLOCATED',
      'READY': 'SPARE_DRIVE_STATE.READY'
    };

    return stateTranslations[this.item.state.toUpperCase()];
  }

  public handleClick(e: MouseEvent): void {
    e.stopPropagation();
    if (!this.mdMenuTrigger.menuOpen) {
      this.onClick.emit(this.item);
    }
  }
}
