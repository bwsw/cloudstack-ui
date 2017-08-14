import { Component, Inject, Input, OnInit, Optional } from '@angular/core';
import { MdlDialogReference } from '../../dialog/dialog-module';

import { DialogService } from '../../dialog/dialog-module/dialog.service';
import { DiskStorageService, Volume } from '../../shared';
import { DiskOffering } from '../../shared/models';
import { DiskOfferingService, JobsNotificationService, VolumeResizeData } from '../../shared/services';
import { VolumeService } from '../../shared/services/volume.service';


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

  public loading: boolean;
  private notificationId: string;

  constructor(
    public dialog: MdlDialogReference,
    private dialogService: DialogService,
    private diskOfferingService: DiskOfferingService,
    private diskStorageService: DiskStorageService,
    private jobsNotificationService: JobsNotificationService,
    private volumeService: VolumeService,
    @Inject('volume') public volume: Volume,
    @Optional() @Inject('diskOfferingList') public diskOfferingListInjected: Array<DiskOffering>,
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
    const includeDiskOffering = this.diskOffering && !this.volume.isRoot;
    const params: VolumeResizeData = Object.assign(
      { id: this.volume.id },
      this.newSize ? { size: this.newSize } : {},
      includeDiskOffering ? { diskOfferingId: this.diskOffering.id } : {}
    );

    this.loading = true;
    this.notificationId = this.jobsNotificationService.add('VOLUME_RESIZING');
    this.volumeService.resize(params)
      .finally(() => this.loading = false)
      .subscribe(
        (volume: Volume) => this.onVolumeResize(volume),
        error => this.handleVolumeResizeError(error)
      );
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

  private onVolumeResize(volume: Volume): void {
    this.jobsNotificationService.finish({
      id: this.notificationId,
      message: 'VOLUME_RESIZED'
    });

    volume.diskOffering = this.diskOffering;
    this.dialog.hide(volume);
  }

  private handleVolumeResizeError(error: Error): void {
    this.jobsNotificationService.fail({
      id: this.notificationId,
      message: 'VOLUME_RESIZE_FAILED'
    });
    this.dialogService.alert(error.message);
  }
}
