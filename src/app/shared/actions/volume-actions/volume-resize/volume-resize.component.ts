import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { MatDialogRef, MatSelectChange } from '@angular/material';
import { DiskOffering } from '../../../models';
import { Volume, isRoot } from '../../../models/volume.model';
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
  public diskOffering: DiskOffering;
  public newSize: number;

  constructor(
    public dialogRef: MatDialogRef<VolumeResizeComponent>
  ) {
  }

  public ngOnInit(): void {
    this.newSize = this.volume.size / Math.pow(2, 30);
  }

  public get canResize(): boolean {
    return (this.diskOfferings && this.diskOfferings.length > 0) || isRoot(this.volume);
  }

  public updateDiskOffering(change: MatSelectChange): void {
    if (change) {
      const diskOfferingId = change.value as string;
      this.diskOffering = this.diskOfferings.find(_ => _.id === diskOfferingId);
    }
  }

  public resizeVolume(): void {
    const includeDiskOffering = this.diskOffering && !isRoot(this.volume);
    const params: VolumeResizeData = Object.assign(
      { id: this.volume.id },
      this.newSize ? { size: this.newSize } : {},
      includeDiskOffering ? { diskofferingid: this.diskOffering.id } : {}
    );
    this.onDiskResized.emit(params);
  }
}
