import { Component, Input } from '@angular/core';

import { Snapshot } from '../../../../../shared/models';
import { SnapshotActionsService } from './snapshot-actions.service';


@Component({
  selector: 'cs-snapshot',
  templateUrl: 'snapshot.component.html',
  styleUrls: ['snapshot.component.scss'],
})
export class SnapshotComponent {
  @Input() public snapshot: Snapshot;

  constructor(public snapshotActions: SnapshotActionsService) { }
}

