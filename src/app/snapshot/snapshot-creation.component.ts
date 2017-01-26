import { Component, Inject } from '@angular/core';
import { MdlDialogReference } from 'angular2-mdl';
import { SnapshotService } from '../shared/services/snapshot.service';
import { JobsNotificationService, INotificationStatus } from '../shared/services/jobs-notification.service';
import { NotificationService } from '../shared/services/notification.service';
import { ErrorService } from '../shared/services/error.service';
import { TranslateService } from 'ng2-translate';
import { StatsUpdateService } from '../shared/services/stats-update.service';


@Component({
  selector: 'cs-snapshot-creation',
  templateUrl: 'snapshot-creation.component.html',
  styleUrls: ['snapshot-creation.component.scss'],
})
export class SnapshotCreationComponent {
  public name: string;

  constructor(
    private dialog: MdlDialogReference,
    private snapshotService: SnapshotService,
    private jobsNotificationService: JobsNotificationService,
    private notificationService: NotificationService,
    private errorService: ErrorService,
    private translateService: TranslateService,
    private statsUpdateService: StatsUpdateService,
    @Inject('volumeId') private volumeId: string
  ) {
    this.name = '';
  }

  public onSubmit(): void {
    this.dialog.hide();
    this.takeSnapshot(this.volumeId, this.name);
  }

  public onHide(): void {
    this.dialog.hide();
  }

  public takeSnapshot(volumeId: string, name: string): void {
    let notificationId = '';
    let translatedStrings = [];
    this.translateService.get([
      'SNAPSHOT_IN_PROGRESS',
      'SNAPSHOT_DONE',
      'SNAPSHOT_FAILED',
      'VOLUME_BUSY',
      'INSUFFICIENT_RESOURCES'
    ])
      .switchMap(strings => {
        translatedStrings = strings;
        notificationId = this.jobsNotificationService.add(translatedStrings['SNAPSHOT_IN_PROGRESS']);
        return this.snapshotService.createSnapshot(volumeId, name);
      })
      .subscribe(() => {
        this.statsUpdateService.next();
        this.jobsNotificationService.add({
          id: notificationId,
          message: translatedStrings['SNAPSHOT_DONE'],
          status: INotificationStatus.Finished
        });
      }, e => {
        this.jobsNotificationService.add({
          id: notificationId,
          message: translatedStrings['SNAPSHOT_FAILED'],
          status: INotificationStatus.Failed
        });
        let error = this.errorService.parseCsError(e);
        if (error === 4350) { this.notificationService.error(translatedStrings['VOLUME_BUSY']); }
        if (error === 4370) { this.notificationService.error(translatedStrings['INSUFFICIENT_RESOURCES']); }
      });
  }
}
