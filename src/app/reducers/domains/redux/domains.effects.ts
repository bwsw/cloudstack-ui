import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { DomainService } from '../../../shared/services/domain.service';
import { Domain } from '../../../shared/models/domain.model';
import * as domainActions from './domains.actions';

@Injectable()
export class DomainsEffects {
  @Effect()
  loadDomains$: Observable<Action> = this.actions$.pipe(
    ofType(domainActions.LOAD_DOMAINS_REQUEST),
    switchMap((action: domainActions.LoadDomainsRequest) => {
      return this.domainService.getList(action.payload).pipe(
        map((domains: Domain[]) => {
          return new domainActions.LoadDomainsResponse(domains);
        }),
        catchError(() => of(new domainActions.LoadDomainsResponse([]))),
      );
    }),
  );

  constructor(private actions$: Actions, private domainService: DomainService) {}
}
