import { ActionReducer, MetaReducer } from '@ngrx/store';
import { storeFreeze } from 'ngrx-store-freeze';

import { State } from './state';
import { environment } from '../../environments/environment';
import { AuthActionTypes } from '../auth/store/auth.actions';

// console.log all actions
export function logger(reducer: ActionReducer<State>): ActionReducer<State> {
  return function(state: State, action: any): State {
    // tslint:disable:no-console
    console.log('state', state);
    console.log('action', action);
    // tslint:enable:no-console

    return reducer(state, action);
  };
}

// clear store if user logs out
export function logout(reducer: ActionReducer<State>) {
  return function(state: State, action: any): State {
    if (action.type === AuthActionTypes.LogoutComplete) {
      // Keep config state because it common for all users
      const configState = state['config'];
      // tslint:disable-next-line:no-parameter-reassignment
      state = {} as State;
      state['config'] = configState;
    }

    return reducer(state, action);
  };
}

// used by hmr to keep state between reloads
export function stateSetter(reducer: ActionReducer<any>): ActionReducer<any> {
  return function(state: any, action: any) {
    if (action.type === 'SET_ROOT_STATE') {
      return action.payload;
    }
    return reducer(state, action);
  };
}

/**
 * By default, @ngrx/store uses combineReducers with the reducer map to compose
 * the root meta-reducer. To add more meta-reducers, provide an array of meta-reducers
 * that will be composed to form the root meta-reducer.
 */
export const metaReducers: MetaReducer<State>[] = !environment.production
  ? [logger, logout, stateSetter, storeFreeze]
  : [logout];
