import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { DiskOffering } from '../../shared/models/disk-offering.model';
import { Account, Zone } from '../../shared/models';
import { VolumeCreationData } from '../../shared/models/volume.model';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'cs-volume-creation-dialog',
  templateUrl: 'volume-creation-dialog.component.html',
  styleUrls: ['volume-creation-dialog.component.scss'],
})
export class VolumeCreationDialogComponent {
  public newVolume = new VolumeCreationData();

  @Input()
  public isLoading: boolean;
  @Input()
  public diskOfferings: DiskOffering[];
  @Input()
  public zones: Zone[];
  @Input()
  public storageAvailable: string;
  @Input()
  public account: Account;
  @Input()
  public minSize: number;
  @Input()
  public maxSize: number;
  @Output()
  public volumeCreated = new EventEmitter<VolumeCreationData>();
  @Output()
  public zoneUpdated = new EventEmitter<Zone>();

  public diskOffering: DiskOffering;
  public showResizeSlider: boolean;

  constructor(
    public dialogRef: MatDialogRef<VolumeCreationDialogComponent>,
    public authService: AuthService,
  ) {
    this.newVolume.size = this.minSize;
  }

  public onSubmit(e): void {
    e.preventDefault();

    if (!this.diskOffering.iscustomized) {
      delete this.newVolume.size;
    }

    this.volumeCreated.emit(this.newVolume);
  }

  public updateDiskOffering(diskOffering: DiskOffering): void {
    this.newVolume.diskofferingid = diskOffering.id;
    this.newVolume.size = diskOffering.disksize;
    this.diskOffering = diskOffering;
    this.showResizeSlider = this.diskOffering.iscustomized;
  }

  public updateZone(zoneId: string) {
    this.zoneUpdated.emit(this.zones.find(zone => zone.id === zoneId));
  }
}
