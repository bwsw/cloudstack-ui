import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, filter, map, switchMap } from 'rxjs/operators';

import * as event from './events.actions';
import { EventService } from '../event.service';
import { Event } from '../event.model';
import { formatIso } from '../../shared/components/date-picker/dateUtils';

@Injectable()
export class EventsEffects {
  @Effect()
  loadFilterEventsByDate$: Observable<Action> = this.actions$.pipe(
    ofType(event.EVENT_FILTER_UPDATE),
    filter((action: event.EventFilterUpdate) => action.payload.date),
    map((action: event.EventFilterUpdate) => action.payload.date),
    map(
      date =>
        new event.LoadEventsRequest({
          startDate: formatIso(date),
          endDate: formatIso(date),
        }),
    ),
  );

  @Effect()
  loadEvents$: Observable<Action> = this.actions$.pipe(
    ofType(event.LOAD_EVENTS_REQUEST),
    switchMap((action: event.LoadEventsRequest) => {
      return this.eventService.getListAll(action.payload).pipe(
        map((events: Event[]) => {
          return new event.LoadEventsResponse(events);
        }),
        catchError(() => of(new event.LoadEventsResponse([]))),
      );
    }),
  );

  constructor(private actions$: Actions, private eventService: EventService) {}
}
