import { Component, Inject, OnInit } from '@angular/core';
import moment = require('moment');


import {
  JobsNotificationService,
  SnapshotService,
  StatsUpdateService
} from '../../../../../shared/services';
import { ResourceUsageService, ResourceStats } from '../../../../../shared/services/resource-usage.service';
import { DialogService } from '../../../../../shared/services/dialog/dialog.service';
import { Volume } from '../../../../../shared/models/volume.model';
import { MdlDialogReference } from '../../../../../shared/services/dialog';


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
    this.takeSnapshot(this.volume.id, this.name);
  }

  public onHide(): void {
    this.dialog.hide();
  }

  public takeSnapshot(volumeId: string, name: string): void {
    let notificationId = this.jobsNotificationService.add('SNAPSHOT_IN_PROGRESS');
    this.snapshotService.create(volumeId, name)
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
