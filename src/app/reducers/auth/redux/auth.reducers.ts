import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ResourceStats } from '../../../shared/services/resource-usage.service';
import { Account } from '../../../shared/models/account.model';

import * as authActions from './auth.actions';
import * as fromDomains from '../../domains/redux/domains.reducers';

/**
 * @ngrx/entity provides a predefined interface for handling
 * a structured dictionary of records. This interface
 * includes an array of ids, and a dictionary of the provided
 * model type by id. This interface is extended to include
 * any additional interface properties.
 */

export interface State {
  loading: boolean,
  account: Account;
  accountId: string
}

export interface UserAccountState {
  entity: State;
}

const initialUserAccountState: State = {
  loading: false,
  account: null,
  accountId: ''
};

export const userAccountReducers = {
  entity: reducer,
};

export function reducer(state = initialUserAccountState, action: authActions.Actions): State {
  switch (action.type) {
    case authActions.LOAD_USER_ACCOUNT_REQUEST: {
      return {
        ...state,
        loading: true
      };
    }
    case authActions.LOAD_USER_ACCOUNT_RESPONSE: {
      return {
        ...state,
        account: action.payload,
        accountId: action.payload.id,
        loading: false
      };
    }
    default: {
      return state;
    }
  }
}

export const getUserAccountState = createFeatureSelector<UserAccountState>('userAccount');


export const getUserAccountEntity = createSelector(
  getUserAccountState,
  state => state.entity
);

export const getUserAccount = createSelector(
  getUserAccountEntity,
  state => state.account
);

export const getUserAccountId = createSelector(
  getUserAccountEntity,
  state => state.accountId
);

export const isLoading = createSelector(
  getUserAccountEntity,
  state => state.loading
);

export const getUserAvailableResources = createSelector(
  getUserAccount,
  fromDomains.selectEntities,
  (user, domains) => {
    const domainResources = domains && user && domains[user.domainid]
      && ResourceStats.fromAccount([domains[user.domainid]]);
    const userResources = user && ResourceStats.fromAccount([user]);

    const result = (domainResources ? Object.entries(domainResources.available) : [])
      .reduce((m, [key, value]) => ({
        ...m, [key]: Math.min(userResources.available[key], value)
      }), {});

    return userResources &&
      { ...userResources, available: { ...userResources.available, ...result } };
  }
);
