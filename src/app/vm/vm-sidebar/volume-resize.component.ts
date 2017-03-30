import { Component, Inject, OnInit } from '@angular/core';
import { MdlDialogReference } from 'angular2-mdl';

import { Volume, DiskStorageService } from '../../shared';
import { DiskOffering } from '../../shared/models/disk-offering.model';


export interface VolumeResizeData {
  id: string;
  diskOfferingId?: string;
  size?: number;
}

@Component({
  selector: 'cs-volume-resize',
  templateUrl: 'volume-resize.component.html',
  styleUrls: ['volume-resize.component.scss']
})
export class VolumeResizeComponent implements OnInit {
  public newSize: number;
  public maxSize: number;

  public diskOffering: DiskOffering;
  public diskOfferingList: Array<DiskOffering>;

  constructor(
    @Inject('diskOfferingList') public diskOfferingListInjected: Array<DiskOffering>,
    @Inject('volume') public volume: Volume,
    public dialog: MdlDialogReference,
    private diskStorageService: DiskStorageService
  ) {
    this.newSize = this.volume.size / Math.pow(2, 30);
    this.maxSize = 0; // to prevent mdl-slider from incorrect initial rendering
  }

  public ngOnInit(): void {
    if (this.diskOfferingListInjected && !this.diskOfferingList) {
      this.diskOfferingList = this.diskOfferingListInjected;
    }

    this.diskStorageService.getAvailablePrimaryStorage()
      .subscribe((limit: number) => this.maxSize = limit);
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
}
