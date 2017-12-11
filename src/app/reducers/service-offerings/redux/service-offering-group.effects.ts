import { Injectable } from '@angular/core';
import {
  Actions,
  Effect
} from '@ngrx/effects';
import * as actions from './service-offering-group.actions';
import { ConfigService } from '../../../shared/services/config.service';

@Injectable()
export class ServiceOfferingEffects {

  @Effect()
  loadServiceOfferingGroups$ = this.actions$
    .ofType(actions.LOAD_SERVICE_OFFERING_GROUP_REQUEST)
    .switchMap((action: actions.LoadServiceOfferingGroupRequest) => {
      return this.configService.get('serviceOfferingGroups')
        .map(groupList => new actions.LoadServiceOfferingGroupResponse(groupList));
    });

  constructor(
    private actions$: Actions,
    private configService: ConfigService
  ) { }
}
