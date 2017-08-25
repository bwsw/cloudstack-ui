import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Volume } from '../../shared/models/volume.model';
import { SpareDriveAttachmentComponent } from '../spare-drive-attachment/spare-drive-attachment.component';
import { SpareDriveAction } from './spare-drive-action';


@Injectable()
export class SpareDriveAttachAction extends SpareDriveAction {
  public name = 'VOLUME_ACTIONS.ATTACH';
  public icon = 'attach_file';

  public activate(volume: Volume): Observable<any> {
    return this.dialogService.showCustomDialog({
      component: SpareDriveAttachmentComponent,
      providers: [
        { provide: 'volume', useValue: volume },
        { provide: 'zoneId', useValue: volume.zoneId }
      ],
      classes: 'spare-drive-attachment-dialog'
    })
      .switchMap(res => res.onHide());
  }

  public hidden(volume: Volume): boolean {
    return !volume.isSpare;
  }
}
