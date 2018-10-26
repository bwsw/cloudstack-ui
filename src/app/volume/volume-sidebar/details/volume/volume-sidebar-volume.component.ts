import { Component, Input } from '@angular/core';
import { Volume } from '../../../../shared/models/volume.model';
import * as moment from 'moment';

@Component({
  selector: 'cs-volume-sidebar-volume',
  templateUrl: 'volume-sidebar-volume.component.html',
})
export class VolumeSidebarVolumeComponent {
  @Input()
  public volume: Volume;

  public get diskOfferingStorageType(): string {
    const storageTypeTranslations = {
      SHARED: 'DISK_OFFERING_STORAGE_TYPE.SHARED',
      LOCAL: 'DISK_OFFERING_STORAGE_TYPE.LOCAL',
    };

    return storageTypeTranslations[this.volume.storagetype.toUpperCase()];
  }

  public get volumeCreated(): Date {
    return moment(this.volume.created).toDate();
  }
}
