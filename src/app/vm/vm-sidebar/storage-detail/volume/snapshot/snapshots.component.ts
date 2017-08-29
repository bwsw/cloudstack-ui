import { Component, Input } from '@angular/core';
import { MdDialog } from '@angular/material';
import { Volume } from '../../../../../shared/models';
import { SnapshotActionsService } from './snapshot-actions.service';
import { SnapshotModalComponent } from './snapshot-modal.component';


@Component({
  selector: 'cs-snapshots',
  templateUrl: 'snapshots.component.html',
  styleUrls: ['snapshots.component.scss']
})
export class SnapshotsComponent {
  @Input() public volume: Volume;

  constructor(
    public snapshotActionsService: SnapshotActionsService,
    private dialog: MdDialog
  ) {}

  public showSnapshots(): void {
    this.dialog.open(SnapshotModalComponent, {
      data: this.volume,
      width: '700px'
    });
  }
}
