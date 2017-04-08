import { Component, Inject } from '@angular/core';
import { MdlDialogReference } from 'angular2-mdl';

import { Snapshot, Volume } from '../../../../../shared/models';
import { SnapshotActionsService } from './snapshot-actions.service';

@Component({
  selector: 'cs-snapshot-modal',
  templateUrl: 'snapshot-modal.component.html'
})
export class SnapshotModalComponent {
  constructor(
    public snapshotActions: SnapshotActionsService,
    public dialog: MdlDialogReference,
    @Inject('snapshots') public snapshots: Array<Snapshot>,
    @Inject('volume') public volume: Volume
  ) { }
}
