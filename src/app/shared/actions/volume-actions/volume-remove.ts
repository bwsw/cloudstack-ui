import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Volume } from '../../models/volume.model';
import { VolumeAction } from './volume-action';


@Injectable()
export class VolumeRemoveAction extends VolumeAction {
  public name = 'COMMON.DELETE';
  public icon = 'delete';

  public activate(volume: Volume): Observable<any> {
    return this.dialogService.confirm({
      message: 'DIALOG_MESSAGES.VOLUME.CONFIRM_DELETION'
    })
      .onErrorResumeNext()
      .switchMap(res => {
        if (res) {
          return this.onConfirm(volume);
        } else {
          return Observable.of(null);
        }
      });
  }

  public onConfirm(volume: Volume): Observable<any> {
    const notificationId = this.jobsNotificationService.add({
      message: 'JOB_NOTIFICATIONS.VOLUME.DELETION_IN_PROGRESS'
    });

    return this.volumeService.remove(volume)
      .do(() => {
        this.jobsNotificationService.finish({
          id: notificationId,
          message: 'JOB_NOTIFICATIONS.VOLUME.DELETION_DONE'
        });
      })
      .catch(error => {
        this.dialogService.alert(error);
        this.jobsNotificationService.fail({
          id: notificationId,
          message: 'JOB_NOTIFICATIONS.VOLUME.DELETION_FAILED'
        });
        return Observable.throw(error);
      });
  }

  public hidden(volume: Volume): boolean {
    return volume.isRoot;
  }
}
