import { Injectable } from '@angular/core';
import { ActionsService } from '../shared/interfaces/action-service.interface';
import { Action } from '../shared/interfaces/action.interface';
import { Volume } from '../shared/models';
import { SpareDriveAttachAction } from './spare-drive-actions/spare-drive-attach';
import { SpareDriveRemoveAction } from './spare-drive-actions/spare-drive-remove';
import { SpareDriveResizeAction } from './spare-drive-actions/spare-drive-resize';
import { SpareDriveDetachAction } from './spare-drive-actions/spare-drive-detach';


@Injectable()
export class SpareDriveActionsService implements ActionsService<Volume, Action<Volume>> {
  public actions = [
    this.spareDriveAttachAction,
    this.spareDriveResizeAction,
    this.spareDriveRemoveAction
  ];

  constructor(
    public spareDriveAttachAction: SpareDriveAttachAction,
    public spareDriveDetachAction: SpareDriveDetachAction,
    public spareDriveResizeAction: SpareDriveResizeAction,
    public spareDriveRemoveAction: SpareDriveRemoveAction
  ) {}
}
