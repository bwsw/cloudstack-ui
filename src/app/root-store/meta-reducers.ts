// console.log all actions
import { ActionReducer, MetaReducer } from '@ngrx/store';
import { storeFreeze } from 'ngrx-store-freeze';

import { State } from './state';
import { environment } from '../../environments/environment';
import { AuthActionTypes } from '../auth/store/auth.actions';

export function logger(reducer: ActionReducer<State>): ActionReducer<State> {
  return function (state: State, action: any): State {
    console.log('state', state);
    console.log('action', action);

    return reducer(state, action);
  };
}

// clear store if user logs out
export function logout(reducer: ActionReducer<State>) {
  return function (state: State, action: any): State {
    if (action.type === AuthActionTypes.LogoutComplete) {
      state = undefined;
    }

    return reducer(state, action);
  }
}

/**
 * By default, @ngrx/store uses combineReducers with the reducer map to compose
 * the root meta-reducer. To add more meta-reducers, provide an array of meta-reducers
 * that will be composed to form the root meta-reducer.
 */
export const metaReducers: MetaReducer<State>[] = !environment.production
  ? [logger, logout, storeFreeze]
  : [logout];
