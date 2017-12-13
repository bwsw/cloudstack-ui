import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import * as event from './events.actions';
import { Action } from '@ngrx/store';
import { EventService } from '../event.service';
import { Event } from '../event.model';
import { formatIso } from '../../shared/components/date-picker/dateUtils';

@Injectable()
export class EventsEffects {

  @Effect()
  loadFilterEventsByDate$: Observable<Action> = this.actions$
    .ofType(event.EVENT_FILTER_UPDATE)
    .filter((action: event.EventFilterUpdate) => action.payload.date)
    .map((action: event.EventFilterUpdate) => action.payload.date)
    .map(date => new event.LoadEventsRequest({
      startDate: formatIso(date),
      endDate: formatIso(date)
    }));

  @Effect()
  loadEvents$: Observable<Action> = this.actions$
    .ofType(event.LOAD_EVENTS_REQUEST)
    .switchMap((action: event.LoadEventsRequest) => {
      return this.eventService
        .getListAll(action.payload)
        .map((events: Event[]) => {
          return new event.LoadEventsResponse(events);
        })
        .catch(() => Observable.of(new event.LoadEventsResponse([])));
    });

  constructor(
    private actions$: Actions,
    private eventService: EventService
  ) {
  }
}
