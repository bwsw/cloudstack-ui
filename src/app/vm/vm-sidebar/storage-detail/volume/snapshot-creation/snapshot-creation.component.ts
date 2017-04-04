import { Component, Inject, OnInit } from '@angular/core';
import { MdlDialogReference } from 'angular2-mdl';


import {
  ErrorService,
  JobsNotificationService,
  NotificationService,
  SnapshotService,
  StatsUpdateService
} from '../../../../../shared/services';
import { ResourceUsageService, ResourceStats } from '../../../../../shared/services/resource-usage.service';


@Component({
  selector: 'cs-snapshot-creation',
  templateUrl: 'snapshot-creation.component.html',
  styleUrls: ['snapshot-creation.component.scss']
})
export class SnapshotCreationComponent implements OnInit {
  public name: string;

  public loading = true;
  public enoughResources: boolean;

  constructor(
    private dialog: MdlDialogReference,
    private snapshotService: SnapshotService,
    private jobsNotificationService: JobsNotificationService,
    private notificationService: NotificationService,
    private errorService: ErrorService,
    private statsUpdateService: StatsUpdateService,
    @Inject('volumeId') private volumeId: string,
    private resourceUsageService: ResourceUsageService
  ) {
    this.name = '';
  }

  public ngOnInit(): void {
    this.resourceUsageService.getResourceUsage()
      .subscribe((resourceStats: ResourceStats) => {
        this.loading = false;
        this.enoughResources = resourceStats.available.snapshots > 0;
      });
  }

  public onSubmit(): void {
    this.dialog.hide();
    this.takeSnapshot(this.volumeId, this.name);
  }

  public onHide(): void {
    this.dialog.hide();
  }

  public takeSnapshot(volumeId: string, name: string): void {
    let notificationId = this.jobsNotificationService.add('SNAPSHOT_IN_PROGRESS');
    this.snapshotService.create(volumeId, name)
      .subscribe(
        () => {
          this.statsUpdateService.next();
          this.jobsNotificationService.finish({
            id: notificationId,
            message: 'SNAPSHOT_DONE'
          });
        },
        e => {
          this.jobsNotificationService.fail({
            id: notificationId,
            message: 'SNAPSHOT_FAILED'
          });
          let error = this.errorService.parseCsError(e);
          if (error === 4350) { this.notificationService.error('VOLUME_BUSY'); }
          if (error === 4370) { this.notificationService.error('INSUFFICIENT_RESOURCES'); }
        });
  }
}
