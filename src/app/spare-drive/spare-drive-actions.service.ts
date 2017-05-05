import { Injectable } from '@angular/core';
import { VolumeAttachmentData, VolumeService } from '../shared/services/volume.service';
import { DialogService, JobsNotificationService } from '../shared/services';
import { Subject } from 'rxjs/Subject';


@Injectable()
export class SpareDriveActionsService {
  public volumeAttached: Subject<void>;

  constructor(
    private dialogService: DialogService,
    private jobsNotificationService: JobsNotificationService,
    private volumeService: VolumeService
  ) {
    this.volumeAttached = new Subject<void>();
  }

  public attach(data: VolumeAttachmentData): void {
    let notificationId = this.jobsNotificationService.add('VOLUME_ATTACH_IN_PROGRESS');
    this.volumeService.attach(data)
      .subscribe(
        () => {
          this.volumeAttached.next();
          this.jobsNotificationService.finish({
            id: notificationId,
            message: 'VOLUME_ATTACH_DONE',
          });
        },
        error => {
          this.dialogService.alert(error.message);
          this.jobsNotificationService.fail({
            id: notificationId,
            message: 'VOLUME_ATTACH_FAILED',
          });
        });
  }
}
