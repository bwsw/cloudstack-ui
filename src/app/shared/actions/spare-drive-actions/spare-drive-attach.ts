import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Volume } from '../../models/volume.model';
import { SpareDriveAttachmentComponent } from '../../../spare-drive/spare-drive-attachment/spare-drive-attachment.component';
import { SpareDriveAction } from './spare-drive-action';


@Injectable()
export class SpareDriveAttachAction extends SpareDriveAction {
  public name = 'VOLUME_ACTIONS.ATTACH';
  public icon = 'attach_file';

  public activate(volume: Volume): Observable<any> {
    return this.dialog.open(SpareDriveAttachmentComponent, {
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
