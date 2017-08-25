import { Component, Inject } from '@angular/core';

import { Volume } from '../../../../../shared/models';
import { SnapshotActionsService } from '../../../../../snapshot/snapshot-actions.service';
import { MdlDialogReference } from '../../../../../dialog/dialog-module';

@Component({
  selector: 'cs-snapshot-modal',
  templateUrl: 'snapshot-modal.component.html',
  styleUrls: ['snapshot-modal.component.scss']
})
export class SnapshotModalComponent {
  constructor(
    public snapshotActionsService: SnapshotActionsService,
    public dialog: MdlDialogReference,
    @Inject('volume') public volume: Volume
  ) { }
}
