import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Volume } from '../../shared/models/volume.model';
import { SpareDriveAction } from './spare-drive-action';


@Injectable()
export class SpareDriveRemoveAction extends SpareDriveAction {
  public name = 'COMMON.DELETE';
  public icon = 'delete';

  public activate(volume: Volume): Observable<any> {
    return this.dialogService.confirm(
      'DIALOG_MESSAGES.VOLUME.CONFIRM_DELETION',
      'COMMON.NO',
      'COMMON.YES'
    )
      .onErrorResumeNext()
      .do(() => this.jobsNotificationService.finish({
        message: 'JOB_NOTIFICATIONS.VOLUME.DELETION_IN_PROGRESS'
      }))
      .switchMap(() => this.volumeService.remove(volume))
      .map(() => this.jobsNotificationService.finish({
        message: 'JOB_NOTIFICATIONS.VOLUME.DELETION_DONE'
      }))
      .catch(error => {
        this.dialogService.alert(error);
        this.jobsNotificationService.fail({
          message: 'JOB_NOTIFICATIONS.VOLUME.DELETION_FAILED'
        });
        return Observable.throw(error);
      });
  }
}
