import { Injectable } from '@angular/core';
import { ActionsService } from '../../interfaces/action-service.interface';
import { Action } from '../../interfaces/action.interface';
import { Iso } from '../../../template/shared/iso.model';
import { IsoDeleteAction } from './delete/iso-delete';

@Injectable()
export class IsoActionsService implements ActionsService<Iso, Action<Iso>> {
  public actions = [this.isoDeleteAction];

  constructor(public isoDeleteAction: IsoDeleteAction) {}
}
