import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { DialogService } from '../dialog/dialog-module/dialog.service';
import { Volume } from '../shared/models';
import { JobsNotificationService } from '../shared/services/jobs-notification.service';
import { VolumeAttachmentData, VolumeService } from '../shared/services/volume.service';


export enum VolumeAttachmentEvent {
  ATTACHED = 'attached',
  DETACHED = 'detached'
}

@Injectable()
export class SpareDriveActionsService {
  public onVolumeAttachment: Subject<VolumeAttachmentEvent>;

  constructor(
    private dialogService: DialogService,
    private jobsNotificationService: JobsNotificationService,
    private volumeService: VolumeService
  ) {
    this.onVolumeAttachment = new Subject<VolumeAttachmentEvent>();
  }

  public attach(data: VolumeAttachmentData): Observable<void> {
    const notificationId = this.jobsNotificationService.add('JOB_NOTIFICATIONS.VOLUME.ATTACHMENT_IN_PROGRESS');
    return this.volumeService.attach(data)
      .do(() => {
        this.onVolumeAttachment.next(VolumeAttachmentEvent.ATTACHED);
        this.jobsNotificationService.finish({
          id: notificationId,
          message: 'JOB_NOTIFICATIONS.VOLUME.ATTACHMENT_DONE',
        });
      })
      .catch(error => {
        this.dialogService.alert({
          translationToken: error.message,
          interpolateParams: error.params
        });
        this.jobsNotificationService.fail({
          id: notificationId,
          message: 'JOB_NOTIFICATIONS.VOLUME.ATTACHMENT_FAILED',
        });
        return Observable.throw(error);
      });
  }

  public detach(volume: Volume): Observable<void> {
    const notificationId = this.jobsNotificationService.add('JOB_NOTIFICATIONS.VM.DETACHMENT_IN_PROGRESS');
    return this.volumeService.detach(volume.id)
      .do(() => {
        this.onVolumeAttachment.next(VolumeAttachmentEvent.DETACHED);
        this.jobsNotificationService.finish({
          id: notificationId,
          message: 'JOB_NOTIFICATIONS.VOLUME.DETACHMENT_DONE'
        });
      })
      .catch(error => {
        this.dialogService.alert({
          translationToken: error.message,
          interpolateParams: error.params
        });
        this.jobsNotificationService.fail({
          id: notificationId,
          message: 'JOB_NOTIFICATIONS.VOLUME.DETACHMENT_FAILED',
        });
        return Observable.throw(error);
      });
  }
}
