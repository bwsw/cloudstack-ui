import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Volume } from '../../models/volume.model';
import { SpareDriveAction } from './spare-drive-action';


@Injectable()
export class SpareDriveDetachAction extends SpareDriveAction {
  public name = 'VM_PAGE.STORAGE_DETAILS.DETACH';
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
    this.jobsNotificationService.add({message: 'VOLUME_DETACH_IN_PROGRESS'});

    return this.volumeService.detach(volume)
      .do(() => this.jobsNotificationService.finish({
        message: 'VOLUME_DETACH_DONE'
      }))
      .catch(error => {
        this.dialogService.alert(error);
        this.jobsNotificationService.fail({message: 'VOLUME_DETACH_FAILED'});
        return Observable.throw(error);
      });
  }
}
