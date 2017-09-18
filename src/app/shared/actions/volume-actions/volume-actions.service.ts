import { Injectable } from '@angular/core';
import { ActionsService } from '../../interfaces/action-service.interface';
import { Action } from '../../interfaces/action.interface';
import { Volume } from '../../models';
import { VolumeAttachAction } from './volume-attach';
import { VolumeRemoveAction } from './volume-remove';
import { VolumeResizeAction } from './volume-resize';
import { VolumeDetachAction } from './volume-detach';
import { VolumeSnapshotAction } from './volume-snapshot';
import { VolumeRecurringSnapshotsAction } from './volume-recurring-snapshots';


@Injectable()
export class VolumeActionsService implements ActionsService<Volume, Action<Volume>> {
  public actions = [
    this.volumeSnapshotAction,
    this.volumeRecurringSnapshotsAction,
    this.volumeAttachAction,
    this.volumeDetachAction,
    this.volumeResizeAction,
    this.volumeRemoveAction
  ];

  constructor(
    public volumeSnapshotAction: VolumeSnapshotAction,
    public volumeRecurringSnapshotsAction: VolumeRecurringSnapshotsAction,
    public volumeAttachAction: VolumeAttachAction,
    public volumeDetachAction: VolumeDetachAction,
    public volumeResizeAction: VolumeResizeAction,
    public volumeRemoveAction: VolumeRemoveAction
  ) {}
}
