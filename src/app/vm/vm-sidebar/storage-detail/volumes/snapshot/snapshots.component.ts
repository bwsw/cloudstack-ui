import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { MatDialog } from '@angular/material';
import { Volume } from '../../../../../shared/models';
import {
  SnapshotAction,
  SnapshotActionsService
} from '../../../../../snapshot/snapshot-actions.service';
import { Snapshot } from '../../../../../shared/models/snapshot.model';
import { SnapshotModalContainerComponent } from './snapshot-modal.container';


@Component({
  selector: 'cs-snapshots',
  templateUrl: 'snapshots.component.html',
  styleUrls: ['snapshots.component.scss']
})
export class SnapshotsComponent {
  @Input() public volume: Volume;
  @Output() public onSnapshotDelete = new EventEmitter<Snapshot>();
  public actions: Array<SnapshotAction>;

  constructor(
    public snapshotActionsService: SnapshotActionsService,
    private dialog: MatDialog,
  ) {
    this.actions = snapshotActionsService.actions;
  }

  public showSnapshots(): void {
    this.dialog.open(SnapshotModalContainerComponent, {
      data: { volume: this.volume },
      width: '700px'
    }).afterClosed();
  }

  public onAction(action: SnapshotAction, snapshot: Snapshot) {
    action.activate(snapshot).subscribe(
      () => {
        if (action.command === 'delete') {
          this.onSnapshotDelete.emit(snapshot);
        }
      });
  }
}
