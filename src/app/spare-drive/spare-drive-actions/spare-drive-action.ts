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

  constructor(
    protected dialogService: DialogService,
    protected jobsNotificationService: JobsNotificationService,
    protected volumeService: VolumeService
  ) {}

  public abstract activate(volume: Volume, params?: {}): Observable<any>;

  public hidden(volume: Volume): boolean {
    return false;
  }
}
