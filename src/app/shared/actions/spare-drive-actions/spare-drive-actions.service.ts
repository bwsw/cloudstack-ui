import { Injectable } from '@angular/core';
import { ActionsService } from '../../interfaces/action-service.interface';
import { Action } from '../../interfaces/action.interface';
import { Volume } from '../../models';
import { SpareDriveAttachAction } from './volume-attach';
import { SpareDriveRemoveAction } from './volume-remove';
import { SpareDriveResizeAction } from './volume-resize';
import { SpareDriveDetachAction } from './volume-detach';
import { SpareDriveSnapshotAction } from './volume-snapshot';
import { SpareDriveRecurringSnapshotsAction } from './volume-recurring-snapshots';


@Injectable()
export class SpareDriveActionsService implements ActionsService<Volume, Action<Volume>> {
  public actions = [
    this.spareDriveSnapshotAction,
    this.spareDriveRecurringSnapshotsAction,
    this.spareDriveAttachAction,
    this.spareDriveDetachAction,
    this.spareDriveResizeAction,
    this.spareDriveRemoveAction
  ];

  constructor(
    public spareDriveSnapshotAction: SpareDriveSnapshotAction,
    public spareDriveRecurringSnapshotsAction: SpareDriveRecurringSnapshotsAction,
    public spareDriveAttachAction: SpareDriveAttachAction,
    public spareDriveDetachAction: SpareDriveDetachAction,
    public spareDriveResizeAction: SpareDriveResizeAction,
    public spareDriveRemoveAction: SpareDriveRemoveAction
  ) {}
}
