import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Volume } from '../../shared/models/volume.model';
import { SpareDriveAction } from './spare-drive-action';


@Injectable()
export class SpareDriveDetachAction extends SpareDriveAction {
  public name = 'VOLUME_ACTIONS.DETACH';
  public icon = 'remove';

  public activate(volume: Volume): Observable<any> {
    return this.dialogService.confirm(
      'DIALOG_MESSAGES.VOLUME.CONFIRM_DETACHMENT',
      'COMMON.NO',
      'COMMON.YES'
    )
      .onErrorResumeNext()
      .do(() => this.jobsNotificationService.finish({
        message: 'JOB_NOTIFICATIONS.VOLUME.DETACHMENT_IN_PROGRESS'
      }))
      .switchMap(() => this.volumeService.detach(volume))
      .map(() => this.jobsNotificationService.finish({
        message: 'JOB_NOTIFICATIONS.VOLUME.DETACHMENT_DONE'
      }))
      .catch(error => {
        this.dialogService.alert(error);
        this.jobsNotificationService.fail({
          message: 'JOB_NOTIFICATIONS.VOLUME.DETACHMENT_FAILED'
        });
        return Observable.throw(error);
      });
  }

  public hidden(volume: Volume): boolean {
    return volume.isSpare;
  }
}
