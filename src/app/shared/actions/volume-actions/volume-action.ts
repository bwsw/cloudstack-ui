import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { DialogService } from '../../../dialog/dialog-service/dialog.service';
import { Action } from '../../interfaces/action.interface';
import { Volume } from '../../models/volume.model';
import { JobsNotificationService } from '../../services/jobs-notification.service';
import { VolumeService } from '../../services/volume.service';


@Injectable()
export abstract class VolumeAction implements Action<Volume> {
  public name: string;
  public icon?: string;

  constructor(
    protected dialog: MatDialog,
    protected dialogService: DialogService,
    protected jobsNotificationService: JobsNotificationService,
    protected volumeService: VolumeService
  ) {}

  public abstract activate(volume: Volume, params?: {}): Observable<any>;

  public canActivate(volume: Volume): boolean {
    return true;
  }

  public hidden(volume: Volume): boolean {
    return false;
  }
}
