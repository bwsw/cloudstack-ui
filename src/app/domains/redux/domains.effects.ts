import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import * as domainEvent from './domains.actions';
import { Action } from '@ngrx/store';
import { DomainService } from '../../shared/services/domain.service';
import { Domain } from '../../shared/models/domain.model';
import { AuthService } from '../../shared/services/auth.service';

@Injectable()
export class DomainsEffects {

  @Effect()
  loadEvents$: Observable<Action> = this.actions$
    .ofType(domainEvent.LOAD_DOMAINS_REQUEST)
    .switchMap((action: domainEvent.LoadDomainsRequest) => {
      return this.authService.isAdmin() ? this.domainService.getList(action.payload)
        .map((domains: Domain[]) => {
          return new domainEvent.LoadDomainsResponse(domains);
        })
        .catch(() => Observable.of(new domainEvent.LoadDomainsResponse([]))) :
        Observable.of(new domainEvent.LoadDomainsResponse([]));
    });

  constructor(
    private actions$: Actions,
    private domainService: DomainService,
    private authService: AuthService
  ) { }
}
