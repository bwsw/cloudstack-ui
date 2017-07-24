import { Component, Inject } from '@angular/core';
import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material';

import { Volume } from '../../../../../shared/models';
import { SnapshotActionsService } from './snapshot-actions.service';

@Component({
  selector: 'cs-snapshot-modal',
  templateUrl: 'snapshot-modal.component.html',
  styleUrls: ['snapshot-modal.component.scss']
})
export class SnapshotModalComponent {
  constructor(
    public snapshotActionsService: SnapshotActionsService,
    public dialogRef: MdDialogRef<SnapshotModalComponent>,
    @Inject(MD_DIALOG_DATA) public volume: Volume
  ) { }
}
