import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { DialogService } from '../dialog/dialog-module/dialog.service';
import { ActionsService } from '../shared/interfaces/action-service.interface';
import { Action } from '../shared/interfaces/action.interface';
import { Volume } from '../shared/models';
import { JobsNotificationService } from '../shared/services';
import { VolumeAttachmentData, VolumeService } from '../shared/services/volume.service';
import { SpareDriveAttachmentComponent } from './spare-drive-attachment/spare-drive-attachment.component';


export type VolumeAttachmentEvent = 'attached' | 'detached';
export const VolumeAttachmentEvents = {
  ATTACHED: 'attached' as VolumeAttachmentEvent,
  DETACHED: 'detached' as VolumeAttachmentEvent
};

@Injectable()
export class SpareDriveActionsService implements ActionsService<Volume, Action<Volume>> {
  public actions = [
    {
      name: 'ATTACH',
      icon: 'attach_file',
      action: volume => this.showVolumeAttachmentDialog(volume)
    },
    {
      name: 'RESIZE',
      icon: 'photo_size_select_small',
      action: volume => this.showVolumeResizeDialog(volume)
    },
    {
      name: 'DELETE',
      icon: 'delete',
      action: volume => this.showVolumeRemoveDialog(volume)
    }
  ];
  public onVolumeAttachment: Subject<VolumeAttachmentEvent>;

  constructor(
    private dialogService: DialogService,
    private jobsNotificationService: JobsNotificationService,
    private volumeService: VolumeService
  ) {
    this.onVolumeAttachment = new Subject<VolumeAttachmentEvent>();
  }

  // public attach(data: VolumeAttachmentData): Observable<void> {
  //   const notificationId = this.jobsNotificationService.add('VOLUME_ATTACH_IN_PROGRESS');
  //   return this.volumeService.attach(data)
  //     .map(() => {
  //       this.onVolumeAttachment.next(VolumeAttachmentEvents.ATTACHED);
  //       this.jobsNotificationService.finish({
  //         id: notificationId,
  //         message: 'VOLUME_ATTACH_DONE',
  //       });
  //     })
  //     .catch(error => {
  //       this.dialogService.alert({
  //         translationToken: error.message,
  //         interpolateParams: error.params
  //       });
  //       this.jobsNotificationService.fail({
  //         id: notificationId,
  //         message: 'VOLUME_ATTACH_FAILED',
  //       });
  //       return error;
  //     });
  // }
  //
  // public detach(volume: Volume): Observable<void> {
  //   const notificationId = this.jobsNotificationService.add('VOLUME_DETACH_IN_PROGRESS');
  //   return this.volumeService.detach(volume.id)
  //     .map(() => {
  //       this.onVolumeAttachment.next(VolumeAttachmentEvents.DETACHED);
  //       this.jobsNotificationService.finish({
  //         id: notificationId,
  //         message: 'VOLUME_DETACH_DONE'
  //       });
  //     })
  //     .catch(error => {
  //       this.dialogService.alert({
  //         translationToken: error.message,
  //         interpolateParams: error.params
  //       });
  //       this.jobsNotificationService.fail({
  //         id: notificationId,
  //         message: 'VOLUME_DETACH_FAILED',
  //       });
  //       return error;
  //     });
  // }
  //
  // public showVolumeAttachmentDialog(volume: Volume): void {
  //   this.dialogService.showCustomDialog({
  //     component: SpareDriveAttachmentComponent,
  //     providers: [
  //       { provide: 'volume', useValue: volume },
  //       { provide: 'zoneId', useValue: volume.zoneId }
  //     ],
  //     classes: 'spare-drive-attachment-dialog'
  //   })
  //     .switchMap(res => res.onHide())
  //     .subscribe(virtualMachineId => {
  //       if (!virtualMachineId) {
  //         return;
  //       }
  //       this.onVolumeAttached.emit({
  //         id: volume.id,
  //         virtualMachineId
  //       });
  //     });
  //
  // }
  //
  // public showVolumeResizeDialog(volume: Volume): void {
  //
  // }
  //
  // public showVolumeRemoveDialog(volume: Volume): void {
  //
  // }
}
