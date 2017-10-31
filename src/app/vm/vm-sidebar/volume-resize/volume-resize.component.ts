import {
  Component,
  Inject,
  OnInit
} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef
} from '@angular/material';
import { DiskOffering } from '../../../shared/models';
import { Volume } from '../../../shared/models/volume.model';
import { VolumeResizeData } from '../../../shared/services/volume.service';


@Component({
  selector: 'cs-volume-resize',
  templateUrl: 'volume-resize.component.html',
  styleUrls: ['volume-resize.component.scss']
})
export class VolumeResizeComponent implements OnInit {
  public newSize: number;
  public maxSize: number;
  public volume: Volume;

  public diskOffering: DiskOffering;
  public diskOfferings: Array<DiskOffering>;

  public loading: boolean;

  constructor(
    public dialogRef: MatDialogRef<VolumeResizeComponent>,
    @Inject(MAT_DIALOG_DATA) data,
  ) {
    this.volume = data.volume;
    this.diskOfferings = data.diskOfferings;
    this.maxSize = data.maxSize;
  }

  public ngOnInit(): void {
    this.newSize = this.volume.size / Math.pow(2, 30);
  }

  public get canResize(): boolean {
    return (this.diskOfferings && this.diskOfferings.length > 0) || this.volume.isRoot;
  }

  public updateDiskOffering(diskOffering: DiskOffering): void {
    this.diskOffering = diskOffering;
  }

  public resizeVolume(): void {
    const includeDiskOffering = this.diskOffering && !this.volume.isRoot;
    const params: VolumeResizeData = Object.assign(
      { id: this.volume.id },
      this.newSize ? { size: this.newSize } : {},
      includeDiskOffering ? { diskOfferingId: this.diskOffering.id } : {}
    );

    this.dialogRef.close(params);
  }
}
