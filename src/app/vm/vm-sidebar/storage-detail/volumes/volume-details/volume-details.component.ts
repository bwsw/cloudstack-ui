import {
  Component,
  Input
} from '@angular/core';
import {
  DiskOffering,
  Volume
} from '../../../../../shared/models';

@Component({
  selector: 'cs-volume-details',
  templateUrl: 'volume-details.component.html',
  styleUrls: ['volume-details.component.scss'],
})
export class VolumeDetailsComponent {
  @Input() public volume: Volume;
  @Input() public diskOffering: DiskOffering;


  public get storageTypeTranslationToken(): string {
    const storageTypeTranslations = {
      'SHARED': 'DISK_OFFERING_STORAGE_TYPE.SHARED',
      'LOCAL': 'DISK_OFFERING_STORAGE_TYPE.LOCAL'
    };

    return storageTypeTranslations[this.volume.storageType.toUpperCase()];
  }

  public hasPerformanceInfo(): boolean {
    if (!this.volume || !this.diskOffering) {
      return false;
    }

    const diskOffering = this.diskOffering;
    return [
      diskOffering.minIops,
      diskOffering.maxIops,
      diskOffering.diskBytesReadRate,
      diskOffering.diskBytesWriteRate,
      diskOffering.diskIopsReadRate,
      diskOffering.diskIopsWriteRate
    ].some(a => a !== undefined);
  }
}
