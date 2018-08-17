import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { ConfigService } from '../../../core/services';
import * as actions from './service-offering-class.actions';

@Injectable()
export class ServiceOfferingClassEffects {

  @Effect()
  loadServiceOfferingClasses$: Observable<Action> = this.actions$
    .ofType(actions.LOAD_SERVICE_OFFERING_CLASS_REQUEST)
    .switchMap((action: actions.LoadServiceOfferingClassRequest) => {
      return Observable.of(this.configService.get('serviceOfferingClasses'))
        .map(classList => new actions.LoadServiceOfferingClassResponse(classList))
        .catch(() => Observable.of(new actions.LoadServiceOfferingClassResponse([])));
    });

  constructor(
    private actions$: Actions,
    private configService: ConfigService
  ) { }
}
