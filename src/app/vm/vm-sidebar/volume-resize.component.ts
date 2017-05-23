import { Component, Inject, OnInit, Optional, Input } from '@angular/core';

import { Volume, DiskStorageService } from '../../shared';
import { DiskOffering } from '../../shared/models';
import { VolumeResizeData } from '../../shared/services';
import { MdlDialogReference } from '../../dialog/dialog-module';


@Component({
  selector: 'cs-volume-resize',
  templateUrl: 'volume-resize.component.html',
  styleUrls: ['volume-resize.component.scss']
})
export class VolumeResizeComponent implements OnInit {
  public newSize: number;
  public maxSize: number;

  public diskOffering: DiskOffering;
  @Input() public diskOfferingList: Array<DiskOffering>;

  constructor(
    @Optional() @Inject('diskOfferingList') public diskOfferingListInjected: Array<DiskOffering>,
    @Inject('volume') public volume: Volume,
    public dialog: MdlDialogReference,
    private diskStorageService: DiskStorageService
  ) {}

  public ngOnInit(): void {
    this.getInjectedOfferingList();
    this.updateSliderLimits();
    this.setDefaultOffering();
  }

  public get canResize(): boolean {
    return (this.diskOfferingList && this.diskOfferingList.length > 0) || this.volume.isRoot;
  }

  public updateDiskOffering(diskOffering: DiskOffering): void {
    this.diskOffering = diskOffering;
  }

  public resizeVolume(): void {
    let params: VolumeResizeData = { id: this.volume.id };

    if (this.diskOffering) {
      params.diskOfferingId = this.diskOffering.id;
    }
    if (this.newSize) {
      params.size = this.newSize;
    }

    this.dialog.hide(params);
  }

  private setDefaultOffering(): void {
    if (this.diskOfferingList.length) {
      this.diskOffering = this.diskOfferingList[0];
    }
  }

  private getInjectedOfferingList(): void {
    if (this.diskOfferingListInjected && !this.diskOfferingList) {
      this.diskOfferingList = this.diskOfferingListInjected;
    }
  }

  private updateSliderLimits(): void {
    this.newSize = this.volume.size / Math.pow(2, 30);
    this.maxSize = 0; // to prevent mdl-slider from incorrect initial rendering

    this.diskStorageService.getAvailablePrimaryStorage()
      .subscribe((limit: number) => this.maxSize = limit);
  }
}
