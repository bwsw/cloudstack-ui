import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { filter, map, withLatestFrom } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import * as flatten from 'lodash/flatten';

import { Route, Subroute } from './models';
import { appNavRoutes } from './routes';
import { routerSelectors, State } from '../../root-store';

@Injectable()
export class NavMenuService {
  constructor(private store: Store<State>) {}

  public getRoutes(): Observable<Route[]> {
    return of(appNavRoutes);
  }

  public getSubroutes(): Observable<Subroute[]> {
    return this.getCurrentRoute().pipe(map(route => route.subroutes));
  }

  public getCurrentRoute(): Observable<Route> {
    return this.getCurrentSubroute().pipe(
      filter(subroute => !!subroute),
      withLatestFrom(this.getRoutes()),
      map(([subroute, routes]) => routes.find(route => route.id === subroute.routeId)),
    );
  }

  private getCurrentSubroute(): Observable<Subroute> {
    return this.getCurrentSubroutePath().pipe(
      withLatestFrom(this.getAllSubroutes()),
      map(([path, subroutes]) => {
        return subroutes.find(subroute => subroute.path === path);
      }),
    );
  }

  private getCurrentSubroutePath(): Observable<string> {
    return this.store.pipe(
      select(routerSelectors.getUrl),
      filter(url => url !== ''),
      map(url => {
        const matches = url.match(/^\/[A-Za-z-]*/);
        return matches[0];
      }),
    );
  }

  private getAllSubroutes(): Observable<Subroute[]> {
    return this.getRoutes().pipe(
      map(routes => routes.map(route => route.subroutes)),
      map(flatten),
    );
  }
}
