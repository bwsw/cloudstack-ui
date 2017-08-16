import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { VolumeAttachmentData, VolumeService } from '../shared/services/volume.service';
import { JobsNotificationService } from '../shared/services';
import { Subject } from 'rxjs/Subject';
import { DialogService } from '../dialog/dialog-module/dialog.service';
import { Volume } from '../shared/models';


export type VolumeAttachmentEvent = 'attached' | 'detached';
export const VolumeAttachmentEvents = {
  ATTACHED: 'attached' as VolumeAttachmentEvent,
  DETACHED: 'detached' as VolumeAttachmentEvent
};

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
      .map(() => {
        this.onVolumeAttachment.next(VolumeAttachmentEvents.ATTACHED);
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
        return error;
      });
  }

  public detach(volume: Volume): Observable<void> {
    const notificationId = this.jobsNotificationService.add('JOB_NOTIFICATIONS.VM.DETACHMENT_IN_PROGRESS');
    return this.volumeService.detach(volume.id)
      .map(() => {
        this.onVolumeAttachment.next(VolumeAttachmentEvents.DETACHED);
        this.jobsNotificationService.finish({
          id: notificationId,
          message: 'JOB_NOTIFICATIONS.VM.DETACHMENT_DONE'
        });
      })
      .catch(error => {
        this.dialogService.alert({
          translationToken: error.message,
          interpolateParams: error.params
        });
        this.jobsNotificationService.fail({
          id: notificationId,
          message: 'JOB_NOTIFICATIONS.VM.DETACHMENT_FAILED',
        });
        return error;
      });
  }
}
