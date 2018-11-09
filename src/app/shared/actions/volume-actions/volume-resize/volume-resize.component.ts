import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { DiskOffering } from '../../../models';
import { isRoot, Volume } from '../../../models/volume.model';
import { VolumeResizeData } from '../../../services/volume.service';
import { isCustomized } from '../../../models/offering.model';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'cs-volume-resize',
  templateUrl: 'volume-resize.component.html',
  styleUrls: ['volume-resize.component.scss'],
})
export class VolumeResizeComponent implements OnInit, OnChanges {
  @Input()
  public maxSize: number;
  @Input()
  public volume: Volume;
  @Input()
  public diskOfferings: DiskOffering[];
  @Input()
  public availableStorage: number | null;
  @Output()
  public diskResized = new EventEmitter<VolumeResizeData>();

  public diskOffering: DiskOffering;
  public newSize: number;

  public get rootDiskSizeLimit(): number {
    const maxRootCapability = this.authService.getCustomDiskOfferingMaxSize();
    if (this.maxSize.toString() === 'Unlimited' && maxRootCapability) {
      return maxRootCapability;
    }
    if (Number(this.maxSize) < maxRootCapability) {
      return Number(this.maxSize);
    }
    return maxRootCapability;
  }

  public get volumeIsRoot(): boolean {
    return isRoot(this.volume);
  }

  public get canResize(): boolean {
    return (this.diskOfferings && this.diskOfferings.length > 0) || isRoot(this.volume);
  }

  constructor(
    public dialogRef: MatDialogRef<VolumeResizeComponent>,
    public authService: AuthService,
  ) {}

  public ngOnInit(): void {
    this.newSize = this.volume.size / Math.pow(2, 30);
    if (!!this.availableStorage) {
      this.availableStorage = this.availableStorage + this.newSize;
    }
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if ('diskOfferings' in changes) {
      this.diskOffering = this.diskOfferings.find(_ => _.id === this.volume.diskofferingid);
    }
  }

  public isCustomizedForVolume(diskOffering: DiskOffering): boolean {
    if (diskOffering) {
      return isCustomized(diskOffering);
    }
  }

  public updateDiskOffering(value: DiskOffering): void {
    this.diskOffering = value;
    this.newSize = value.disksize;
  }

  public resizeVolume(): void {
    const params: VolumeResizeData = {
      id: this.volume.id,
      size: this.newSize,
      diskofferingid: this.diskOffering && this.diskOffering.id,
    };
    this.diskResized.emit(params);
  }
}
