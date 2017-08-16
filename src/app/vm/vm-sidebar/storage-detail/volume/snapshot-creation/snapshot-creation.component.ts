import { Component, Inject, OnInit } from '@angular/core';
import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material';
import * as moment from 'moment';


import {
  JobsNotificationService,
  SnapshotService,
  StatsUpdateService
} from '../../../../../shared/services';
import { ResourceUsageService, ResourceStats } from '../../../../../shared/services/resource-usage.service';
import { DialogService } from '../../../../../dialog/dialog-module/dialog.service';
import { Volume } from '../../../../../shared/models/volume.model';


@Component({
  selector: 'cs-snapshot-creation',
  templateUrl: 'snapshot-creation.component.html',
  styleUrls: ['snapshot-creation.component.scss']
})
export class SnapshotCreationComponent implements OnInit {
  public name: string;
  public description: string;

  public loading = true;
  public enoughResources: boolean;

  constructor(
    private dialogRef: MdDialogRef<SnapshotCreationComponent>,
    private dialogService: DialogService,
    private snapshotService: SnapshotService,
    private jobsNotificationService: JobsNotificationService,
    private statsUpdateService: StatsUpdateService,
    @Inject(MD_DIALOG_DATA) private volume: Volume,
    private resourceUsageService: ResourceUsageService,
  ) {}

  public ngOnInit(): void {
    this.name = this.defaultName;

    this.resourceUsageService.getResourceUsage()
      .subscribe((resourceStats: ResourceStats) => {
        this.loading = false;
        this.enoughResources = resourceStats.available.snapshots > 0;
      });
  }

  public get defaultName(): string {
    return moment().format('YYMMDD-HHmm');
  }

  public onSubmit(): void {
    this.dialogRef.close();
    this.takeSnapshot(this.volume.id, this.name, this.description);
  }

  public onHide(): void {
    this.dialogRef.close();
  }

  public takeSnapshot(volumeId: string, name: string, description: string): void {
    const notificationId = this.jobsNotificationService.add('SNAPSHOT_IN_PROGRESS');
    this.snapshotService.create(volumeId, name, description)
      .subscribe(
        (result: any) => {
          this.statsUpdateService.next();
          this.jobsNotificationService.finish({
            id: notificationId,
            message: 'SNAPSHOT_DONE'
          });
          this.volume.snapshots.unshift(result);
        },
        e => {
          this.jobsNotificationService.fail({
            id: notificationId,
            message: 'SNAPSHOT_FAILED'
          });

          this.dialogService.alert({
            translationToken: e.message,
            interpolateParams: e.params
          });
        });
  }
}
