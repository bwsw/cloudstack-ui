import { Component, Input, EventEmitter, Output } from '@angular/core';
import { Snapshot } from '../../shared/models/snapshot.model';

@Component({
  selector: 'cs-snapshot',
  templateUrl: 'snapshot.component.html',
  styleUrls: ['snapshot.component.scss']
})
export class SnapshotComponent {
  @Input() public snapshot: Snapshot;
  @Output() public onSnapshotDelete = new EventEmitter<Snapshot>();

  public deleteSnapshot(): void {
    this.onSnapshotDelete.emit(this.snapshot);
  }
}

