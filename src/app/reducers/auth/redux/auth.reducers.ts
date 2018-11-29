import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as event from './auth.actions';

/**
 * @ngrx/entity provides a predefined interface for handling
 * a structured dictionary of records. This interface
 * includes an array of ids, and a dictionary of the provided
 * model type by id. This interface is extended to include
 * any additional interface properties.
 */

export interface State {
  loading: boolean;
  accountId: string;
}

export interface UserAccountState {
  entity: State;
}

const initialUserAccountState: State = {
  loading: false,
  accountId: '',
};

export const userAccountReducers = {
  entity: reducer,
};

export function reducer(state = initialUserAccountState, action: event.Actions): State {
  switch (action.type) {
    case event.LOAD_USER_ACCOUNT_REQUEST: {
      return {
        ...state,
        loading: true,
      };
    }
    case event.LOAD_USER_ACCOUNT_RESPONSE: {
      return {
        ...state,
        accountId: action.payload.id,
        loading: false,
      };
    }
    default: {
      return state;
    }
  }
}

export const getUserAccountState = createFeatureSelector<UserAccountState>('userAccount');

export const getUserAccountEntity = createSelector(getUserAccountState, state => state.entity);

export const getUserAccountId = createSelector(getUserAccountEntity, state => state.accountId);

export const isLoading = createSelector(getUserAccountEntity, state => state.loading);
