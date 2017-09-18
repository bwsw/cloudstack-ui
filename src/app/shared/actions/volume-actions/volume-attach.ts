import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Volume } from '../../models/volume.model';
import {
  VolumeAttachmentComponent
} from './volume-attachment/volume-attachment.component';
import { VolumeAction } from './volume-action';


@Injectable()
export class VolumeAttachAction extends VolumeAction {
  public name = 'VOLUME_ACTIONS.ATTACH';
  public icon = 'attach_file';

  public activate(volume: Volume): Observable<any> {
    return this.dialog.open(VolumeAttachmentComponent, {
      data: {
        volume,
        zoneId: volume.zoneId
      },
      width: '375px'
    })
      .afterClosed();
  }

  public hidden(volume: Volume): boolean {
    return !volume.isSpare;
  }
}
