import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Volume } from '../../models/volume.model';
import { VolumeAction } from './volume-action';
import { DialogService } from '../../../dialog/dialog-service/dialog.service';


@Injectable()
export class VolumeRemoveAction implements VolumeAction {
  public name = 'COMMON.DELETE';
  public command = 'delete';
  public icon = 'delete';

  constructor (
    public dialogService: DialogService
  ) {}

  public activate(volume: Volume): Observable<any> {
    return this.dialogService.confirm({
      message: 'DIALOG_MESSAGES.VOLUME.CONFIRM_DELETION'
    })
      .onErrorResumeNext()
      .filter(res => Boolean(res))
      .map(res => volume);
  }

  public hidden = (volume: Volume) => volume.isRoot;
}
