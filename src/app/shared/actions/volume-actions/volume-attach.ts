import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Volume } from '../../models/volume.model';
import { VolumeAction } from './volume-action';
import { MatDialog } from '@angular/material';
import { VolumeAttachmentContainerComponent } from './volume-attachment/volume-attachment.container';


@Injectable()
export class VolumeAttachAction implements VolumeAction {
  public name = 'VOLUME_ACTIONS.ATTACH';
  public command = 'attach';
  public icon = 'attach_file';

  constructor( public dialog: MatDialog) { }

  public activate(volume: Volume): Observable<any> {
    return this.dialog.open(VolumeAttachmentContainerComponent, {
      data: {
        volume,
        zoneId: volume.zoneid
      },
      width: '375px'
    })
      .afterClosed()
      .filter(res => Boolean(res));
  }

  public canActivate(volume: Volume): boolean {
    return true;
  }

  public hidden(volume: Volume): boolean {
    return !!volume.virtualmachineid;
  }
}
