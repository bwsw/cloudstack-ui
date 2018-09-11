import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { catchError, first, map, switchMap } from 'rxjs/operators';

import * as actions from './service-offering-class.actions';
import { configSelectors, State } from '../../../root-store';

@Injectable()
export class ServiceOfferingClassEffects {

  @Effect()
  loadServiceOfferingClasses$: Observable<Action> = this.actions$.pipe(
    ofType<actions.LoadServiceOfferingClassRequest>(actions.LOAD_SERVICE_OFFERING_CLASS_REQUEST),
    switchMap(() => this.store.select(configSelectors.get('serviceOfferingClasses')).pipe(
      first(),
      map(classList => new actions.LoadServiceOfferingClassResponse(classList)),
      catchError(() => Observable.of(new actions.LoadServiceOfferingClassResponse([])))
    ))
  );

  constructor(
    private actions$: Actions,
    private store: Store<State>,
  ) {
  }
}
