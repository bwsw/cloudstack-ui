import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Volume } from '../../models/volume.model';
import { VolumeAttachmentComponent } from './volume-attachment/volume-attachment.component';
import { VolumeAction } from './volume-action';
import { MatDialog } from '@angular/material';


@Injectable()
export class VolumeAttachAction implements VolumeAction {
  public name = 'VOLUME_ACTIONS.ATTACH';
  public command = 'attach';
  public icon = 'attach_file';

  constructor( public dialog: MatDialog) { }

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
