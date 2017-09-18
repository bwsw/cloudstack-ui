import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Volume } from '../../models/volume.model';
import { SpareDriveAction } from './volume-action';


@Injectable()
export class SpareDriveDetachAction extends SpareDriveAction {
  public name = 'VOLUME_ACTIONS.DETACH';
  public icon = 'remove';

  public activate(volume: Volume): Observable<any> {
    return this.dialogService.confirm({ message: 'DIALOG_MESSAGES.VOLUME.CONFIRM_DETACHMENT' })
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
    const id = this.jobsNotificationService.add({
      message: 'JOB_NOTIFICATIONS.VOLUME.DETACHMENT_IN_PROGRESS'
    });

    return this.volumeService.detach(volume)
      .do(() => this.jobsNotificationService.finish({
        id,
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
    return volume.isSpare || volume.isRoot;
  }
}
