import { Injectable } from '@angular/core';
import { ActionsService } from '../../shared/interfaces/action-service.interface';
import { Action } from '../../shared/interfaces/action.interface';
import { Iso } from '../shared/iso.model';
import { IsoDeleteAction } from './delete/iso-delete';


@Injectable()
export class IsoActionsService implements ActionsService<Iso, Action<Iso>> {
  public actions = [this.isoDeleteAction];

  constructor(public isoDeleteAction: IsoDeleteAction) {}
}
