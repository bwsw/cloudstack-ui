import { Component, Input } from '@angular/core';

import {
  getDateSnapshotCreated,
  getSnapshotDescription,
  Snapshot,
  SnapshotStates,
  Volume,
} from '../../../shared/models';
import { NgrxEntities } from '../../../shared/interfaces';

@Component({
  selector: 'cs-snapshot-sidebar',
  templateUrl: 'snapshot-sidebar.component.html',
  styleUrls: ['snapshot-sidebar.component.scss'],
})
export class SnapshotSidebarComponent {
  @Input()
  public snapshot: Snapshot;
  @Input()
  public volumes: NgrxEntities<Volume>;
  @Input()
  public isLoading: boolean;

  public stateTranslations = {
    [SnapshotStates.BackedUp]: 'SNAPSHOT_STATE.BACKEDUP',
    [SnapshotStates.BackingUp]: 'SNAPSHOT_STATE.BACKINGUP',
    [SnapshotStates.Creating]: 'SNAPSHOT_STATE.CREATING',
    [SnapshotStates.Allocated]: 'SNAPSHOT_STATE.ALLOCATED',
    [SnapshotStates.Error]: 'SNAPSHOT_STATE.ERROR',
  };

  public get notFound(): boolean {
    return !this.snapshot;
  }

  public get snapshotCreated() {
    return getDateSnapshotCreated(this.snapshot);
  }

  public get snapshotType() {
    return `SNAPSHOT_PAGE.SIDEBAR.TYPES.${this.snapshot.snapshottype}`;
  }

  public get snapshotDescription() {
    return getSnapshotDescription(this.snapshot);
  }

  public get volume() {
    return this.snapshot.volumeid && this.volumes && this.volumes[this.snapshot.volumeid];
  }

  public get statusClass() {
    return [
      SnapshotStates.BackedUp,
      SnapshotStates.BackingUp,
      SnapshotStates.Allocated,
      SnapshotStates.Creating,
      SnapshotStates.Error,
    ]
      .filter(state => this.snapshot.state === state)
      .map(
        state =>
          state === SnapshotStates.BackingUp
            ? 'backing-up'
            : state === SnapshotStates.BackedUp
              ? 'backed-up'
              : state.toLowerCase(),
      );
  }
}
