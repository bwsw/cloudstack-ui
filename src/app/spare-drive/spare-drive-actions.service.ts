import { Injectable } from '@angular/core';
import { VolumeAttachmentData, VolumeService } from '../shared/services/volume.service';
import { DialogService, JobsNotificationService } from '../shared/services';
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
    private volumeService: VolumeService
  ) {
    this.onVolumeAttachment = new Subject<VolumeAttachmentEvent>();
  }

  public attach(data: VolumeAttachmentData): Observable<void> {
    let notificationId = this.jobsNotificationService.add('VOLUME_ATTACH_IN_PROGRESS');
    return this.volumeService.attach(data)
      .map(() => {
        this.onVolumeAttachment.next(VolumeAttachmentEvents.ATTACHED);
        this.jobsNotificationService.finish({
          id: notificationId,
          message: 'VOLUME_ATTACH_DONE',
        });
      })
      .catch(error => {
        this.dialogService.alert({
          translationToken: error.message,
          interpolateParams: error.params
        });
        this.jobsNotificationService.fail({
          id: notificationId,
          message: 'VOLUME_ATTACH_FAILED',
        });
        return error;
      });
  }

  public detach(volume: Volume): Observable<void> {
    let notificationId = this.jobsNotificationService.add('VOLUME_DETACH_IN_PROGRESS');
    return this.volumeService.detach(volume.id)
      .map(() => {
        this.onVolumeAttachment.next(VolumeAttachmentEvents.DETACHED);
        this.jobsNotificationService.finish({
          id: notificationId,
          message: 'VOLUME_DETACH_DONE'
        });
      })
      .catch(error => {
        this.dialogService.alert({
          translationToken: error.message,
          interpolateParams: error.params
        });
        this.jobsNotificationService.fail({
          id: notificationId,
          message: 'VOLUME_DETACH_FAILED',
        });
        return error;
      });
  }
}
