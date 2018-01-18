import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { Account, AccountType } from '../../../shared/models';
import { AuthService } from '../../../shared/services/auth.service';
import { State } from '../../index';
import { Action, Store } from '@ngrx/store';
import { DomainService } from '../../../shared/services/domain.service';
import { Domain } from '../../../shared/models/domain.model';

import * as domainActions from './domains.actions';
import * as fromAuth from '../../auth/redux/auth.reducers';

@Injectable()
export class DomainsEffects {
  @Effect()
  loadDomains$: Observable<Action> = this.actions$
    .ofType(domainActions.LOAD_DOMAINS_REQUEST)
    .filter((action: domainActions.LoadDomainsRequest) => this.authService.isAdmin())
    .switchMap((action: domainActions.LoadDomainsRequest) => {
      return this.domainService.getList(action.payload)
        .map((domains: Domain[]) => {
          return new domainActions.LoadDomainsResponse(domains);
        })
        .catch(() => Observable.of(new domainActions.LoadDomainsResponse([])));
    });

  constructor(
    private actions$: Actions,
    private domainService: DomainService,
    private authService: AuthService
  ) {
  }
}
