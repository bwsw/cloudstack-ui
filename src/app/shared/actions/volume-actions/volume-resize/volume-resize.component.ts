import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { DiskOffering } from '../../../models';
import { Volume } from '../../../models/volume.model';
import { VolumeResizeData } from '../../../services/volume.service';


@Component({
  selector: 'cs-volume-resize',
  templateUrl: 'volume-resize.component.html',
  styleUrls: ['volume-resize.component.scss']
})
export class VolumeResizeComponent implements OnInit {
  @Input() public maxSize: number;
  @Input() public volume: Volume;
  @Input() public diskOfferings: Array<DiskOffering>;
  @Output() public onDiskResized = new EventEmitter<VolumeResizeData>();
  public diskOfferingId: string;
  public newSize: number;

  constructor(
    public dialogRef: MatDialogRef<VolumeResizeComponent>
  ) {
  }

  public ngOnInit(): void {
    this.newSize = this.volume.size / Math.pow(2, 30);
    this.diskOfferingId = this.volume.diskOfferingId;
  }

  public get canResize(): boolean {
    return (this.diskOfferings && this.diskOfferings.length > 0) || this.volume.isRoot;
  }

  public updateDiskOffering(value: string): void {
    const diskOffering = this.diskOfferings.find(_ => _.id === value);
    this.diskOfferingId = diskOffering && diskOffering.id;
  }

  public isCustomized(diskOfferingId: string) {
    const diskOffering = this.diskOfferings.find(_ => _.id === diskOfferingId);
    return diskOffering && diskOffering.isCustomized;
  }

  public resizeVolume(): void {
    const includeDiskOffering = this.diskOfferingId && !this.volume.isRoot;
    const params: VolumeResizeData = Object.assign(
      { id: this.volume.id },
      this.newSize ? { size: this.newSize } : {},
      includeDiskOffering ? { diskOfferingId: this.diskOfferingId } : {}
    );
    this.onDiskResized.emit(params);
  }
}
