import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { DiskOffering } from '../../models/disk-offering.model';
import { Volume } from '../../models/volume.model';
import { VolumeResizeComponent } from '../../../vm/vm-sidebar/volume-resize/volume-resize.component';
import { VolumeAction } from './volume-action';


@Injectable()
export class VolumeResizeAction extends VolumeAction {
  public name = 'VOLUME_ACTIONS.RESIZE';
  public icon = 'photo_size_select_small';

  public activate(volume: Volume, params: { diskOfferings: Array<DiskOffering> }): Observable<any> {
    return this.dialog.open(VolumeResizeComponent, {
      data: {
        volume,
        diskOfferings: params.diskOfferings
      },
      width: '375px'
    })
      .afterClosed();
  }
}
