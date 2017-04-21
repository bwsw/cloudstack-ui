import { Component, Inject, OnInit } from '@angular/core';
import { MdlDialogReference, MdlDialogService } from 'angular2-mdl';
import { TranslateService } from 'ng2-translate';
import moment = require('moment');


import {
  JobsNotificationService,
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
    private dialogService: MdlDialogService,
    private snapshotService: SnapshotService,
    private jobsNotificationService: JobsNotificationService,
    private statsUpdateService: StatsUpdateService,
    @Inject('volumeId') private volumeId: string,
    private resourceUsageService: ResourceUsageService,
    private translateService: TranslateService
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

          this.translateService.get(e.message, e.params)
            .subscribe(str => this.dialogService.alert(str));
        });
  }
}
