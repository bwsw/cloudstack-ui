import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { ConfigService } from '../../../shared/services/config.service';
import * as actions from './service-offering-group.actions';

@Injectable()
export class ServiceOfferingGroupEffects {

  @Effect()
  loadServiceOfferingGroups$ = this.actions$
    .ofType(actions.LOAD_SERVICE_OFFERING_GROUP_REQUEST)
    .switchMap((action: actions.LoadServiceOfferingGroupRequest) => {
      return Observable.of(this.configService.get('serviceOfferingGroups'))
        .map(groupList => new actions.LoadServiceOfferingGroupResponse(groupList ? groupList : []));
    });

  constructor(
    private actions$: Actions,
    private configService: ConfigService
  ) { }
}
