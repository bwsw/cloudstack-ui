import { Component, Input } from '@angular/core';
import { Volume } from '../../../../shared/models/volume.model';


@Component({
  selector: 'cs-spare-drive-sidebar-volume',
  templateUrl: 'spare-drive-sidebar-volume.component.html'
})
export class SpareDriveSidebarVolumeComponent {
  @Input() public volume: Volume;

  public get diskOfferingStorageType(): string {
    const storageTypeTranslations = {
      'SHARED': 'DISK_OFFERING_STORAGE_TYPE.SHARED',
      'LOCAL': 'DISK_OFFERING_STORAGE_TYPE.LOCAL'
    };

    return storageTypeTranslations[this.volume.storageType.toUpperCase()];
  }
}
