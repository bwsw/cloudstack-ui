import { Injectable } from '@angular/core';
import {
  Actions,
  Effect
} from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import * as domainActions from './domains.actions';
import { Action } from '@ngrx/store';
import { DomainService } from '../../../shared/services/domain.service';
import { Domain } from '../../../shared/models/domain.model';

@Injectable()
export class DomainsEffects {

  @Effect()
  loadDomains$: Observable<Action> = this.actions$
    .ofType(domainActions.LOAD_DOMAINS_REQUEST)
    .switchMap((action: domainActions.LoadDomainsRequest) => {
      return this.domainService.getList(action.payload)
        .map((domains: Domain[]) => {
          return new domainActions.LoadDomainsResponse(domains);
        })
        .catch(() => Observable.of(new domainActions.LoadDomainsResponse([])));
    });

  constructor(
    private actions$: Actions,
    private domainService: DomainService
  ) { }
}
