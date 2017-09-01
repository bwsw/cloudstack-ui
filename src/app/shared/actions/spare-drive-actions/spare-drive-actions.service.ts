import { Injectable } from '@angular/core';
import { ActionsService } from '../../interfaces/action-service.interface';
import { Action } from '../../interfaces/action.interface';
import { Volume } from '../../models';
import { SpareDriveAttachAction } from './spare-drive-attach';
import { SpareDriveRemoveAction } from './spare-drive-remove';
import { SpareDriveResizeAction } from './spare-drive-resize';
import { SpareDriveDetachAction } from './spare-drive-detach';
import { SpareDriveSnapshotAction } from './spare-drive-snapshot';
import { SpareDriveRecurringSnapshotsAction } from './spare-drive-recurring-snapshots';


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
