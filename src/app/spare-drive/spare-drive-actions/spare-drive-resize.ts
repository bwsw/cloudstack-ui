import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { DiskOffering } from '../../shared/models/disk-offering.model';
import { Volume } from '../../shared/models/volume.model';
import { VolumeResizeComponent } from '../../vm/vm-sidebar/volume-resize/volume-resize.component';
import { SpareDriveAction } from './spare-drive-action';


@Injectable()
export class SpareDriveResizeAction extends SpareDriveAction {
  public name = 'RESIZE';
  public icon = 'photo_size_select_small';

  public activate(volume: Volume, params: { diskOfferings: Array<DiskOffering> }): Observable<any> {
    return this.dialogService.showCustomDialog({
      component: VolumeResizeComponent,
      providers: [
        { provide: 'volume', useValue: volume },
        { provide: 'diskOfferings', useValue: params.diskOfferings }
      ],
      classes: 'spare-drive-attachment-dialog'
    })
      .switchMap(res => res.onHide());
  }
}
