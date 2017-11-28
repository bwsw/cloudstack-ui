import { createFeatureSelector, createSelector } from '@ngrx/store';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Account } from '../../../shared/models/account.model';
import { AccountUser } from '../../../shared/models/account-user.model';

import * as account from './accounts.actions';

/**
 * @ngrx/entity provides a predefined interface for handling
 * a structured dictionary of records. This interface
 * includes an array of ids, and a dictionary of the provided
 * model type by id. This interface is extended to include
 * any additional interface properties.
 */
export interface State extends EntityState<Account> {
  loading: boolean,
  selectedAccountId: string | null;
  filters: {
    selectedDomainIds: string[],
    selectedRoleNames: string[],
    selectedRoleTypes: string[],
    selectedStates: string[],
    selectedGroupings: any[]
  }
}

export interface AccountsState {
  list: State;
}

export const accountReducers = {
  list: reducer,
};

/**
 * createEntityAdapter creates many an object of helper
 * functions for single or multiple operations
 * against the dictionary of records. The configuration
 * object takes a record id selector function and
 * a sortComparer option which is set to a compare
 * function if the records are to be sorted.
 */
export const adapter: EntityAdapter<Account> = createEntityAdapter<Account>({
  selectId: (item: Account) => item.id,
  sortComparer: false
});

/** getInitialState returns the default initial state
 * for the generated entity state. Initial state
 * additional properties can also be defined.
 */
export const initialState: State = adapter.getInitialState({
  loading: false,
  selectedAccountId: null,
  filters: {
    selectedDomainIds: [],
    selectedRoleTypes: [],
    selectedRoleNames: [],
    selectedStates: [],
    selectedGroupings: []
  }
});

export function reducer(
  state = initialState,
  action: account.Actions
): State {
  switch (action.type) {
    case account.LOAD_ACCOUNTS_REQUEST: {
      return {
        ...state,
        loading: true
      };
    }
    case account.ACCOUNT_FILTER_UPDATE: {
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.payload
        }
      };
    }
    case account.LOAD_ACCOUNTS_RESPONSE: {

      const accounts = action.payload;

      return {
        /**
         * The addMany function provided by the created adapter
         * adds many records to the entity dictionary
         * and returns a new state including those records. If
         * the collection is to be sorted, the adapter will
         * sort each record upon entry into the sorted array.
         */
        ...adapter.addAll(accounts, state),
        loading: false
      };
    }

    case account.LOAD_SELECTED_ACCOUNT: {
      return {
        ...state,
        selectedAccountId: action.payload
      };
    }

    case account.ACCOUNT_CREATE_SUCCESS: {
      return {
        ...adapter.addOne(action.payload, state),
      };
    }

    case account.ACCOUNT_DELETE_SUCCESS: {
      return {
        ...adapter.removeOne(action.payload.id, state),
      };
    }

    case account.UPDATE_ACCOUNT: {
      return {
        ...adapter.updateOne({ id: action.payload.id, changes: action.payload }, state),
      };
    }
    case account.ACCOUNT_USER_CREATE_SUCCESS: {
      if (state.entities[action.payload.accountid]) {
        const users = [...state.entities[action.payload.accountid].user, action.payload];
        return adapter.updateOne(
          { id: action.payload.accountid, changes: { user: users } },
          state
        );
      } else {
        return adapter.addOne(action.payload, state);
      }
    }
    case account.ACCOUNT_USER_GENERATE_KEYS_SUCCESS: {
      const updatedUser: AccountUser = { ...action.payload.user };
      updatedUser.secretkey = action.payload.userKeys.secretkey;
      updatedUser.apikey = action.payload.userKeys.apikey;

      const users = [
        ...state.entities[action.payload.user.accountid].user
          .filter(_ => _.id !== action.payload.user.id),
        updatedUser
      ];

      return adapter.updateOne(
        { id: action.payload.user.accountid, changes: { user: users } },
        state
      );
    }
    case account.ACCOUNT_USER_UPDATE_SUCCESS: {
      const users = [
        ...state.entities[action.payload.accountid].user
          .filter(_ => _.id !== action.payload.id),
        action.payload
      ];

      return adapter.updateOne(
        { id: action.payload.accountid, changes: { user: users } },
        state
      );
    }
    case account.ACCOUNT_USER_DELETE_SUCCESS: {
      const users = [
        ...state.entities[action.payload.accountid].user
          .filter(_ => _.id !== action.payload.id)
      ];
      return adapter.updateOne(
        { id: action.payload.accountid, changes: { user: users } },
        state
      );
    }

    default: {
      return state;
    }
  }
}


export const getAccountsState = createFeatureSelector<AccountsState>('accounts');

export const getAccountsEntitiesState = createSelector(
  getAccountsState,
  state => state.list
);

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors(getAccountsEntitiesState);

export const isLoading = createSelector(
  getAccountsEntitiesState,
  state => state.loading
);

export const getSelectedId = createSelector(
  getAccountsEntitiesState,
  state => state.selectedAccountId
);

export const getSelectedAccount = createSelector(
  getAccountsState,
  getSelectedId,
  (state, selectedId) => state.list.entities[selectedId]
);

export const filters = createSelector(
  getAccountsEntitiesState,
  state => state.filters
);


export const filterSelectedRoleTypes = createSelector(
  filters,
  state => state.selectedRoleTypes
);

export const filterSelectedDomainIds = createSelector(
  filters,
  state => state.selectedDomainIds
);

export const filterSelectedRoleNames = createSelector(
  filters,
  state => state.selectedRoleNames
);

export const filterSelectedStates = createSelector(
  filters,
  state => state.selectedStates
);

export const filterSelectedGroupings = createSelector(
  filters,
  state => state.selectedGroupings
);

export const selectFilteredAccounts = createSelector(
  selectAll,
  filterSelectedRoleTypes,
  filterSelectedRoleNames,
  filterSelectedDomainIds,
  filterSelectedStates,
  (accounts, selectedRoleTypes, selectedRoleNames, selectedDomainIds, selectedStates) => {
    const roleTypeMap = selectedRoleTypes.reduce((m, i) => ({ ...m, [i]: i }), {});
    const roleNamesMap = selectedRoleNames.reduce((m, i) => ({ ...m, [i]: i }), {});
    const domainIdsMap = selectedDomainIds.reduce((m, i) => ({ ...m, [i]: i }), {});
    const statesMap = selectedStates.reduce((m, i) => ({ ...m, [i]: i }), {});


    const selectedRoleTypesFilter =
      account => !selectedRoleTypes.length || !!roleTypeMap[account.roletype];

    const selectedRoleNamesFilter =
      account => !selectedRoleNames.length || !!roleNamesMap[account.rolename];

    const selectedDomainIdsFilter =
      account => !selectedDomainIds.length || !!domainIdsMap[account.domainid];

    const selectedStatesFilter =
      account => !selectedStates.length || !!statesMap[account.state];


    return accounts.filter(account => {
      return selectedDomainIdsFilter(account)
        && selectedStatesFilter(account)
        && selectedRoleTypesFilter(account)
        && selectedRoleNamesFilter(account);
    });
  }
);

