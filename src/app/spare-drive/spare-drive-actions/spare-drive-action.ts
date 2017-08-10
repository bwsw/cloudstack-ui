import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { DialogService } from '../../dialog/dialog-module/dialog.service';
import { Action } from '../../shared/interfaces/action.interface';
import { Volume } from '../../shared/models/volume.model';
import { JobsNotificationService } from '../../shared/services/jobs-notification.service';
import { VolumeService } from '../../shared/services/volume.service';


@Injectable()
export abstract class SpareDriveAction implements Action<Volume> {
  public name: string;
  public icon?: string;

  public tokens?: {
    [key: string]: string;
  };

  constructor(
    protected dialogService: DialogService,
    protected jobsNotificationService: JobsNotificationService,
    protected volumeService: VolumeService
  ) {}

  public abstract activate(volume: Volume, params?: {}): Observable<any>;

  protected addNotifications(actionObservable: Observable<any>): Observable<any> {
    const notificationId = this.jobsNotificationService.add(this.tokens.progressMessage);

    return actionObservable
      .do(() => this.onActionFinished(notificationId))
      .catch(job => this.onActionFailed(notificationId, job));
  }

  protected onActionFinished(notificationId: any): void {
    this.jobsNotificationService.finish({
      id: notificationId,
      message: this.tokens.successMessage
    });
  }

  protected onActionFailed(notificationId: any, job: any): Observable<any> {
    this.dialogService.alert(job.message);
    this.jobsNotificationService.fail({
      id: notificationId,
      message: this.tokens.failMessage
    });

    return job;
  }
}
