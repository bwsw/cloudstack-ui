import { EventEmitter } from '@angular/core';
import { MatMenuTrigger } from '@angular/material';
import { Dictionary } from '@ngrx/entity/src/models';
import { TranslateService } from '@ngx-translate/core';
import { getDateSnapshotCreated, Snapshot, SnapshotStates, Volume } from '../../../shared/models';
import { VirtualMachine } from '../../../vm';

export class SnapshotItemComponent {
  public item: Snapshot;
  public volumes: Dictionary<Volume>;
  public virtualMachines: Dictionary<VirtualMachine>;
  public isSelected: (snapshot: Snapshot) => boolean;
  public query: string;
  public onClick = new EventEmitter<Snapshot>();
  public matMenuTrigger: MatMenuTrigger;

  public stateTranslations = {
    [SnapshotStates.BackedUp]: 'SNAPSHOT_STATE.BACKEDUP',
    [SnapshotStates.BackingUp]: 'SNAPSHOT_STATE.BACKINGUP',
    [SnapshotStates.Creating]: 'SNAPSHOT_STATE.CREATING',
    [SnapshotStates.Allocated]: 'SNAPSHOT_STATE.ALLOCATED',
    [SnapshotStates.Error]: 'SNAPSHOT_STATE.ERROR',
  };

  public get statusClass() {
    return [
      SnapshotStates.BackedUp,
      SnapshotStates.BackingUp,
      SnapshotStates.Allocated,
      SnapshotStates.Creating,
      SnapshotStates.Error,
    ]
      .filter(state => this.item.state === state)
      .map(
        state =>
          state === SnapshotStates.BackingUp
            ? 'backing-up'
            : state === SnapshotStates.BackedUp
              ? 'backed-up'
              : state.toLowerCase(),
      );
  }

  public get snapshotCreated() {
    return getDateSnapshotCreated(this.item);
  }

  public get volumeName() {
    return (
      (this.volumes && this.volumes[this.item.volumeid] && this.volumes[this.item.volumeid].name) ||
      this.translate.instant('SNAPSHOT_PAGE.CARD.VOLUME_DELETED')
    );
  }

  constructor(private translate: TranslateService) {}

  public handleClick(e: MouseEvent): void {
    e.stopPropagation();
    if (!this.matMenuTrigger || !this.matMenuTrigger.menuOpen) {
      this.onClick.emit(this.item);
    }
  }
}
