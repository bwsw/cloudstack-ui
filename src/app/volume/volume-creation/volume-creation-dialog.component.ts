import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { MatDialogRef, MatSelectChange } from '@angular/material';
import { DiskOffering } from '../../shared/models/disk-offering.model';
import { Zone } from '../../shared/models';
import { VolumeCreationData } from '../../shared/models/volume.model';
import { AuthService } from '../../shared/services/auth.service';


@Component({
  selector: 'cs-volume-creation-dialog',
  templateUrl: 'volume-creation-dialog.component.html',
  styleUrls: ['volume-creation-dialog.component.scss']
})
export class VolumeCreationDialogComponent {

  public newVolume = new VolumeCreationData();

  @Input() public isLoading: boolean;
  @Input() public diskOfferings: Array<DiskOffering>;
  @Input() public zones: Array<Zone>;
  @Input() public maxSize: number;
  @Output() public onVolumeCreate = new EventEmitter<VolumeCreationData>();
  @Output() public onZoneUpdated = new EventEmitter<Zone>();

  public diskOffering: DiskOffering;
  public showResizeSlider: boolean;
  public size = 1;
  public minSize = 1;


  constructor(
    public dialogRef: MatDialogRef<VolumeCreationDialogComponent>,
    public authService: AuthService
  ) {
    this.minSize = this.authService.getCustomDiskOfferingMinSize();
  }

  public onSubmit(e): void {
    e.preventDefault();
    const volumeCreationParams = Object.assign(
      {},
      this.newVolume,
      { diskOfferingId: this.diskOffering.id }
      );
    this.onVolumeCreate.emit(volumeCreationParams);
  }

  public updateDiskOffering(change: MatSelectChange): void {
    if (change) {
      const diskOffering = change.value as DiskOffering;
      this.diskOffering = diskOffering;
      this.showResizeSlider = diskOffering.isCustomized;
    }
  }

  public updateZone(zoneId: string) {
    this.onZoneUpdated.emit(this.zones.find(zone => zone.id === zoneId));
  }
}
