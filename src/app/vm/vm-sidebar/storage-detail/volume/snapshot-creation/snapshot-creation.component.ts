import { Component, Inject, OnInit } from '@angular/core';
import * as moment from 'moment';
import { MdlDialogReference } from '../../../../../dialog/dialog-module';
import { DialogService } from '../../../../../dialog/dialog-module/dialog.service';
import { Volume } from '../../../../../shared/models/volume.model';
import { JobsNotificationService } from '../../../../../shared/services/jobs-notification.service';
import {
  ResourceStats,
  ResourceUsageService
} from '../../../../../shared/services/resource-usage.service';
import { SnapshotService } from '../../../../../shared/services/snapshot.service';
import { StatsUpdateService } from '../../../../../shared/services/stats-update.service';


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
    private dialog: MdlDialogReference,
    private dialogService: DialogService,
    private snapshotService: SnapshotService,
    private jobsNotificationService: JobsNotificationService,
    private statsUpdateService: StatsUpdateService,
    @Inject('volume') private volume: Volume,
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
    this.dialog.hide();
    this.takeSnapshot(this.volume.id, this.name, this.description);
  }

  public onHide(): void {
    this.dialog.hide();
  }

  public takeSnapshot(volumeId: string, name: string, description: string): void {
    const notificationId = this.jobsNotificationService.add('JOB_NOTIFICATIONS.SNAPSHOT.TAKE_IN_PROGRESS');
    this.snapshotService.create(volumeId, name, description)
      .subscribe(
        (result: any) => {
          this.statsUpdateService.next();
          this.jobsNotificationService.finish({
            id: notificationId,
            message: 'JOB_NOTIFICATIONS.SNAPSHOT.TAKE_DONE'
          });
          this.volume.snapshots.unshift(result);
        },
        e => {
          this.jobsNotificationService.fail({
            id: notificationId,
            message: 'JOB_NOTIFICATIONS.SNAPSHOT.TAKE_FAILED'
          });

          this.dialogService.alert({
            translationToken: e.message,
            interpolateParams: e.params
          });
        });
  }
}
