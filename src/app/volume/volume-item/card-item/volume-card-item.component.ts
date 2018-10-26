import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material';
import { Volume } from '../../../shared/models';
import { DiskOfferingService } from '../../../shared/services/disk-offering.service';
import { ZoneService } from '../../../shared/services/zone.service';
import { VolumeItemComponent } from '../volume-item.component';

@Component({
  selector: 'cs-volume-card-item',
  templateUrl: 'volume-card-item.component.html',
  styleUrls: ['volume-card-item.component.scss'],
})
export class VolumeCardItemComponent extends VolumeItemComponent {
  @Input()
  public isSelected: (volume) => boolean;
  @Input()
  public searchQuery: () => string;
  @Input()
  public item: Volume;
  // tslint:disable-next-line:no-output-on-prefix
  @Output()
  public onClick = new EventEmitter();
  @ViewChild(MatMenuTrigger)
  public matMenuTrigger: MatMenuTrigger;

  constructor(
    protected diskOfferingService: DiskOfferingService,
    protected zoneService: ZoneService,
  ) {
    super(diskOfferingService, zoneService);
  }
}
