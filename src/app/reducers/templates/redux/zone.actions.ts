import { Action } from '@ngrx/store';
import { Zone } from '../../../shared/models/zone.model';

export const LOAD_ZONES_REQUEST = '[ZONES] LOAD_ZONES_REQUEST';
export const LOAD_ZONES_RESPONSE = '[ZONES] LOAD_ZONES_RESPONSE';

export class LoadZonesRequest implements Action {
  type = LOAD_ZONES_REQUEST;

  constructor(public payload?: any) {}
}

export class LoadZonesResponse implements Action {
  type = LOAD_ZONES_RESPONSE;

  constructor(public payload: Zone[]) {}
}

export type Actions = LoadZonesRequest | LoadZonesResponse;
