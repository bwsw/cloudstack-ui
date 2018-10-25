import { EventEmitter, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatMenuTrigger } from '@angular/material';
import { DiskOffering, Volume, VolumeType } from '../../shared/models';
import { DiskOfferingService } from '../../shared/services/disk-offering.service';
import { ZoneService } from '../../shared/services/zone.service';
import { VolumeItem } from '../volume-item';

export class VolumeItemComponent extends VolumeItem implements OnInit, OnChanges {
  public isSelected: (volume) => boolean;
  public searchQuery: () => string;
  public item: Volume;
  public onClick = new EventEmitter();
  public matMenuTrigger: MatMenuTrigger;

  public diskOfferings: DiskOffering[];
  public query: string;

  constructor(
    protected diskOfferingService: DiskOfferingService,
    protected zoneService: ZoneService,
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

  public get isRoot(): boolean {
    return this.item.type === VolumeType.ROOT;
  }

  public get stateTranslationToken(): string {
    const stateTranslations = {
      ALLOCATED: 'VOLUME_STATE.ALLOCATED',
      READY: 'VOLUME_STATE.READY',
    };

    return stateTranslations[this.item.state.toUpperCase()];
  }

  public handleClick(e: MouseEvent): void {
    e.stopPropagation();
    if (!this.matMenuTrigger.menuOpen) {
      this.onClick.emit(this.item);
    }
  }
}
