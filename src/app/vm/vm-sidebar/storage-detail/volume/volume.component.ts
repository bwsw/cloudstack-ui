import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';

import {
  DiskOffering,
  Volume,
  VolumeType,
  Zone,
} from '../../../../shared';
import { DiskOfferingService } from '../../../../shared/services/disk-offering.service';
import { ZoneService } from '../../../../shared/services/zone.service';

@Component({
  selector: 'cs-volume',
  templateUrl: 'volume.component.html',
  styleUrls: ['volume.component.scss'],
})
export class VolumeComponent implements OnInit {
  @Input() public volume: Volume;
  @Output() public onDetach = new EventEmitter();
  @Output() public onResize = new EventEmitter();

  public diskOfferingList: Array<DiskOffering>;

  public expandDetails: boolean;
  private _loading = false;

  constructor(
    private diskOfferingService: DiskOfferingService,
    private zoneService: ZoneService
  ) {}

  public get loading(): boolean {
    return this._loading || this.volume['loading'];
  }

  public ngOnInit(): void {
    this.expandDetails = false;
    //this.getOfferings();
  }

  public get showAttachmentActions(): boolean {
    return this.volume.type === VolumeType.DATADISK;
  }

  public toggleDetails(): void {
    this.expandDetails = !this.expandDetails;
  }

  public detach(): void {
    this.onDetach.emit(this.volume);
  }

  private getOfferings() {
    let zone;
    return this.zoneService.get(this.volume.zoneId)
      .switchMap((_zone: Zone) => {
        zone = _zone;
        return this.diskOfferingService.getList({ zoneId: zone.id });
      })
      .subscribe(diskOfferings => {
        this.diskOfferingList = diskOfferings.filter((diskOffering: DiskOffering) => {
          return this.diskOfferingService.isOfferingAvailableForVolume(diskOffering, this.volume, zone);
        });
      });
  }
}
