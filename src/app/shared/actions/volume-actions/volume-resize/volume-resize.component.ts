import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
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
  public newSize: number;
  public loading: boolean = false;
  @Input() public maxSize: number;
  @Input() public volume: Volume;
  @Input() public diskOfferings: Array<DiskOffering>;

  @Output() public onDiskResized = new EventEmitter<VolumeResizeData>();
  public diskOffering: DiskOffering;

  constructor(
    public dialogRef: MatDialogRef<VolumeResizeComponent>
  ) {
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
    this.onDiskResized.emit(params);
  }
}
