import { Action } from '@ngrx/store';
import { Subroute } from '../models';

export enum NavMenuActionTypes {
  ADD_SUBROUTE = '[Nav Menu] ADD_SUBROUTE',
}

export class AddSubroute implements Action {
  type = NavMenuActionTypes.ADD_SUBROUTE;

  constructor(readonly payload: Subroute) {}
}

export type NavMenuActionsUnion = AddSubroute;
