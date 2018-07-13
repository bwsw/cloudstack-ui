/* Preload user settings before render main interface */
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { State, UserTagsActions, UserTagsSelectors } from '../root-store';

@Injectable()
export class UserSettingsResolver implements Resolve<boolean> {
  constructor(private store: Store<State>) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    this.store.dispatch(new UserTagsActions.LoadUserTags());

    return this.store.select(UserTagsSelectors.getIsLoading)
      .filter(loading => !loading)
      .first();
  }
}
