import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialogRef } from '@angular/material';
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
  @Input() public account: Account;
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
    const customMinSize = this.authService.getCustomDiskOfferingMinSize();
    this.minSize = customMinSize > this.maxSize ? this.maxSize : customMinSize;
    this.newVolume.size = this.minSize;
  }

  public onSubmit(e): void {
    e.preventDefault();

    if (!this.diskOffering.iscustomized) {
      delete this.newVolume.size;
    }

    this.onVolumeCreate.emit(this.newVolume);
  }

  public updateDiskOffering(diskOffering: DiskOffering): void {
    this.maxSize = this.minSize > this.maxSize ? this.minSize : this.maxSize;
    this.newVolume.diskofferingid = diskOffering.id;
    this.diskOffering = diskOffering;
    this.showResizeSlider = this.diskOffering.iscustomized;
  }

  public updateZone(zoneId: string) {
    this.onZoneUpdated.emit(this.zones.find(zone => zone.id === zoneId));
  }
}
