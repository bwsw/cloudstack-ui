import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild
} from '@angular/core';
import { MdMenuTrigger } from '@angular/material';
import { VolumeActionsService } from '../../../shared/actions/volume-actions/volume-actions.service';
import { Volume } from '../../../shared/models';
import { DiskOfferingService } from '../../../shared/services/disk-offering.service';
import { ZoneService } from '../../../shared/services/zone.service';
import { VolumeItemComponent } from '../volume-item.component';


@Component({
  selector: 'cs-volume-card-item',
  templateUrl: 'volume-card-item.component.html',
  styleUrls: ['volume-card-item.component.scss']
})
export class VolumeCardItemComponent extends VolumeItemComponent {
  @Input() public isSelected: (volume) => boolean;
  @Input() public searchQuery: () => string;
  @Input() public item: Volume;
  @Output() public onClick = new EventEmitter();
  @ViewChild(MdMenuTrigger) public mdMenuTrigger: MdMenuTrigger;

  constructor(
    public volumeActionsService: VolumeActionsService,
    protected diskOfferingService: DiskOfferingService,
    protected zoneService: ZoneService
  ) {
    super(volumeActionsService, diskOfferingService, zoneService);
  }
}
