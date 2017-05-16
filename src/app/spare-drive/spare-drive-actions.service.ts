import { Injectable } from '@angular/core';
import { VolumeAttachmentData, VolumeService } from '../shared/services/volume.service';
import { DialogService, JobsNotificationService, NotificationService } from '../shared/services';
import { Subject } from 'rxjs/Subject';
import { Volume } from '../shared/models';
import { Observable } from 'rxjs/Observable';


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
    private notificationService: NotificationService,
    private volumeService: VolumeService
  ) {
    this.onVolumeAttachment = new Subject<VolumeAttachmentEvent>();
  }

  public attach(data: VolumeAttachmentData): Observable<void> {
    let notificationId = this.jobsNotificationService.add('VOLUME_ATTACH_IN_PROGRESS');
    return this.volumeService.attach(data)
      .map(
        () => {
          this.onVolumeAttachment.next(VolumeAttachmentEvents.ATTACHED);
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

  public detach(volume: Volume): Observable<void> {
    let notificationId = this.jobsNotificationService.add('VOLUME_DETACH_IN_PROGRESS');
    return this.volumeService.detach(volume.id)
      .map(
        () => {
          this.onVolumeAttachment.next(VolumeAttachmentEvents.DETACHED);
          this.jobsNotificationService.finish({
            id: notificationId,
            message: 'VOLUME_DETACH_DONE'
          });
        },
        error => {
          this.notificationService.error(error.errortext);
          this.jobsNotificationService.fail({
            id: notificationId,
            message: 'VOLUME_DETACH_FAILED'
          });
        }
      );
  }
}
