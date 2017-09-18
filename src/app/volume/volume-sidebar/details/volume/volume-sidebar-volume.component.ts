import { Component, Input, OnInit } from '@angular/core';
import { Volume } from '../../../../shared/models/volume.model';
import { VolumeService } from '../../../../shared/services/volume.service';


@Component({
  selector: 'cs-volume-sidebar-volume',
  templateUrl: 'volume-sidebar-volume.component.html'
})
export class VolumeSidebarVolumeComponent implements OnInit {
  @Input() public volume: Volume;

  constructor(private volumeService: VolumeService) {}

  public ngOnInit(): void {
    this.volumeService.onVolumeResized
      .subscribe(volume => this.volume.size = volume.size);
  }

  public get diskOfferingStorageType(): string {
    const storageTypeTranslations = {
      'SHARED': 'DISK_OFFERING_STORAGE_TYPE.SHARED',
      'LOCAL': 'DISK_OFFERING_STORAGE_TYPE.LOCAL'
    };

    return storageTypeTranslations[this.volume.storageType.toUpperCase()];
  }
}
