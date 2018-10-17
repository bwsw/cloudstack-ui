import { Action } from '@ngrx/store';
import { Event } from '../event.model';

export const LOAD_EVENTS_REQUEST = '[Events] LOAD_EVENTS_REQUEST';
export const LOAD_EVENTS_RESPONSE = '[Events] LOAD_EVENTS_RESPONSE';
export const EVENT_FILTER_UPDATE = '[Events] EVENT_FILTER_UPDATE';

export class LoadEventsRequest implements Action {
  type = LOAD_EVENTS_REQUEST;

  constructor(public payload: any) {}
}

export class LoadEventsResponse implements Action {
  type = LOAD_EVENTS_RESPONSE;

  constructor(public payload: Event[]) {}
}

export class EventFilterUpdate implements Action {
  type = EVENT_FILTER_UPDATE;

  constructor(public payload: { [key: string]: any }) {}
}

export type Actions = LoadEventsResponse | LoadEventsRequest | EventFilterUpdate;
