import { switchMap } from 'rxjs/operators';

import { DiskOffering, Volume, Zone } from '../shared/models';
import { DiskOfferingService } from '../shared/services/disk-offering.service';
import { ZoneService } from '../shared/services/zone.service';

export abstract class VolumeItem {
  public item: Volume;
  public diskOfferings: DiskOffering[];

  constructor(
    protected diskOfferingService: DiskOfferingService,
    protected zoneService: ZoneService,
  ) {}

  protected loadDiskOfferings(): void {
    let zone;

    this.zoneService
      .get(this.item.zoneid)
      .pipe(
        switchMap((z: Zone) => {
          zone = z;
          return this.diskOfferingService.getList({ zoneId: zone.id });
        }),
      )
      .subscribe(diskOfferings => {
        this.diskOfferings = diskOfferings.filter((diskOffering: DiskOffering) => {
          return this.diskOfferingService.isOfferingAvailableForVolume(
            diskOffering,
            this.item,
            zone,
          );
        });
      });
  }
}
