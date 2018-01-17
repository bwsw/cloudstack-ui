import { DiskOffering } from '../shared/models/disk-offering.model';
import { Volume } from '../shared/models/volume.model';
import { DiskOfferingService } from '../shared/services/disk-offering.service';
import { ZoneService } from '../shared/services/zone.service';
import { Zone } from '../shared/models/zone.model';


export abstract class VolumeItem {
  public item: Volume;
  public diskOfferings: Array<DiskOffering>;

  constructor(
    protected diskOfferingService: DiskOfferingService,
    protected zoneService: ZoneService
  ) {}

  protected loadDiskOfferings(): void {
    let zone;

    this.zoneService
      .get(this.item.zoneid)
      .switchMap((_zone: Zone) => {
        zone = _zone;
        return this.diskOfferingService.getList({ zoneId: zone.id });
      })
      .subscribe(diskOfferings => {
        this.diskOfferings = diskOfferings.filter((diskOffering: DiskOffering) => {
          return this.diskOfferingService.isOfferingAvailableForVolume(
            diskOffering,
            this.item,
            zone
          );
        });
      });
  }
}
