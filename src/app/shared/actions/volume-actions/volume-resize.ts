import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Volume } from '../../models/volume.model';
import { VolumeAction } from './volume-action';
import { MatDialog } from '@angular/material';
import { VolumeResizeContainerComponent } from './volume-resize.container';


@Injectable()
export class VolumeResizeAction implements VolumeAction {
  public name = 'VOLUME_ACTIONS.RESIZE';
  public command = 'resize';
  public icon = 'photo_size_select_small';

  constructor( public dialog: MatDialog) { }

  public activate(volume: Volume): Observable<any> {
    return this.dialog.open(VolumeResizeContainerComponent, {
      data: {
        volume
      },
      width: '375px'
    })
      .afterClosed();
  }

  public hidden = (volume: Volume) => false;
}
