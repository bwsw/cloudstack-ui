import { Component, Inject, Input, OnInit, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { DialogService } from '../../../dialog/dialog-service/dialog.service';
import { DiskOffering } from '../../../shared/models';
import { Volume } from '../../../shared/models/volume.model';
import { JobsNotificationService } from '../../../shared/services/jobs-notification.service';
import { ResourceUsageService } from '../../../shared/services/resource-usage.service';
import { VolumeResizeData, VolumeService } from '../../../shared/services/volume.service';


@Component({
  selector: 'cs-volume-resize',
  templateUrl: 'volume-resize.component.html',
  styleUrls: ['volume-resize.component.scss']
})
export class VolumeResizeComponent implements OnInit {
  public newSize: number;
  public maxSize: number;
  public volume: Volume;
  public diskOfferingListInjected?: Array<DiskOffering>;

  public diskOffering: DiskOffering;
  public diskOfferings: Array<DiskOffering>;

  public loading: boolean;
  private notificationId: string;

  constructor(
    public dialogRef: MatDialogRef<VolumeResizeComponent>,
    private dialogService: DialogService,
    private jobsNotificationService: JobsNotificationService,
    private resourceUsageService: ResourceUsageService,
    private volumeService: VolumeService,
    @Inject(MAT_DIALOG_DATA) data,
  ) {
    this.volume = data.volume;
    this.diskOfferings = data.diskOfferings;
  }

  public ngOnInit(): void {
    this.getInjectedOfferingList();
    this.updateSliderLimits();
    this.setDefaultOffering();
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

    this.loading = true;
    this.notificationId = this.jobsNotificationService.add('JOB_NOTIFICATIONS.VOLUME.RESIZE_IN_PROGRESS');
    this.volumeService.resize(params)
      .finally(() => this.loading = false)
      .subscribe(
        (volume: Volume) => this.onVolumeResize(volume),
        error => this.handleVolumeResizeError(error)
      );
  }

  private setDefaultOffering(): void {
    if (this.diskOfferings.length) {
      this.diskOffering = this.diskOfferings[0];
    }
  }

  private getInjectedOfferingList(): void {
    if (this.diskOfferingListInjected && !this.diskOfferings) {
      this.diskOfferings = this.diskOfferingListInjected;
    }
  }

  private updateSliderLimits(): void {
    this.newSize = this.volume.size / Math.pow(2, 30);
    this.maxSize = 0; // to prevent slider from incorrect initial rendering TODO: check

    this.resourceUsageService.getResourceUsage()
      .map(usage => usage.available.primaryStorage)
      .subscribe((limit: number) => this.maxSize = limit);
  }

  private onVolumeResize(volume: Volume): void {
    this.jobsNotificationService.finish({
      id: this.notificationId,
      message: 'JOB_NOTIFICATIONS.VOLUME.RESIZE_DONE'
    });

    volume.diskOffering = this.diskOffering;
    this.dialogRef.close(volume);
  }

  private handleVolumeResizeError(error: Error): void {
    this.jobsNotificationService.fail({
      id: this.notificationId,
      message: 'JOB_NOTIFICATIONS.VOLUME.RESIZE_FAILED'
    });
    this.dialogService.alert({ message: error.message });
  }
}
