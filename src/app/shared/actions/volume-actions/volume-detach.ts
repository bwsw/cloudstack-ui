import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Volume } from '../../models/volume.model';
import { VolumeAction } from './volume-action';
import { DialogService } from '../../../dialog/dialog-service/dialog.service';


@Injectable()
export class VolumeDetachAction implements VolumeAction {
  public name = 'VOLUME_ACTIONS.DETACH';
  public command = 'detach';
  public icon = 'remove';

  constructor (public dialogService: DialogService) { }

  public activate(volume: Volume): Observable<any> {
    return this.dialogService.confirm({ message: 'DIALOG_MESSAGES.VOLUME.CONFIRM_DETACHMENT' })
      .onErrorResumeNext()
      .filter(res => Boolean(res))
      .map(res => volume);
  }

  public hidden(volume: Volume): boolean {
    return volume.isSpare || volume.isRoot;
  }
}
