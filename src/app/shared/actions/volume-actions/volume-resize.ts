import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { DiskOffering } from '../../models/disk-offering.model';
import { Volume } from '../../models/volume.model';
import { VolumeResizeComponent } from '../../../vm/vm-sidebar/volume-resize/volume-resize.component';
import { VolumeAction } from './volume-action';
import { MatDialog } from '@angular/material';


@Injectable()
export class VolumeResizeAction implements VolumeAction {
  public name = 'VOLUME_ACTIONS.RESIZE';
  public command = 'resize';
  public icon = 'photo_size_select_small';

  constructor( public dialog: MatDialog) { }

  public activate(volume: Volume, params: { diskOfferings: Array<DiskOffering>, maxSize: number }): Observable<any> {
    return this.dialog.open(VolumeResizeComponent, {
      data: {
        volume,
        diskOfferings: params.diskOfferings,
        maxSize: params.maxSize
      },
      width: '375px'
    })
      .afterClosed();
  }

  public hidden = (volume: Volume) => false;
}
