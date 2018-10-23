import { Action } from '@ngrx/store';

export const LOAD_ZONES_REQUEST = '[ZONES] LOAD_ZONES_REQUEST';
export const LOAD_ZONES_RESPONSE = '[ZONES] LOAD_ZONES_RESPONSE';
export const LOAD_SELECTED_ZONE = '[ZONES] LOAD_SELECTED_ZONE';

export class LoadZonesRequest implements Action {
  type = LOAD_ZONES_REQUEST;

  constructor(public payload?: any) {}
}

export class LoadZonesResponse implements Action {
  type = LOAD_ZONES_RESPONSE;

  constructor(public payload: any) {}
}

export class LoadSelectedZone implements Action {
  type = LOAD_SELECTED_ZONE;

  constructor(public payload: string) {}
}

export type Actions = LoadZonesResponse | LoadZonesRequest | LoadSelectedZone;
