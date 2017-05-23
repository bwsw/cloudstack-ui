import { Component, Inject } from '@angular/core';

import { Volume } from '../../../../../shared/models';
import { SnapshotActionsService } from './snapshot-actions.service';
import { MdlDialogReference } from '../../../../../shared/services/dialog';

@Component({
  selector: 'cs-snapshot-modal',
  templateUrl: 'snapshot-modal.component.html',
  styles: [`
    .snapshot-name {
      max-width: 290px;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  `]
})
export class SnapshotModalComponent {
  constructor(
    public snapshotActionsService: SnapshotActionsService,
    public dialog: MdlDialogReference,
    @Inject('volume') public volume: Volume
  ) { }
}
