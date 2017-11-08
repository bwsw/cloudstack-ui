import {
  createFeatureSelector,
  createSelector
} from '@ngrx/store';
import {
  createEntityAdapter,
  EntityAdapter,
  EntityState
} from '@ngrx/entity';
import * as event from './auth.actions';
import { Account } from '../../../shared/models/account.model';

/**
 * @ngrx/entity provides a predefined interface for handling
 * a structured dictionary of records. This interface
 * includes an array of ids, and a dictionary of the provided
 * model type by id. This interface is extended to include
 * any additional interface properties.
 */
export interface State extends EntityState<Account> {
  loading: boolean,
  userAccount: string;
  userDomainId: string;
  account: Account;
}

export interface AccountState {
  list: State;
}

export const userAccountReducers = {
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
  userAccount: '',
  userDomainId: '',
  account: null
});

export function reducer(
  state = initialState,
  action: event.Actions
): State {
  switch (action.type) {
    case event.LOAD_USER_ACCOUNT_REQUEST: {
      return {
        ...state,
        loading: true,
        userAccount: action.payload.account,
        userDomainId: action.payload.domainId
      };
    }

    case event.LOAD_USER_ACCOUNT_RESPONSE: {

      const account = action.payload;

      return {
        /**
         * The addMany function provided by the created adapter
         * adds many records to the entity dictionary
         * and returns a new state including those records. If
         * the collection is to be sorted, the adapter will
         * sort each record upon entry into the sorted array.
         */
        ...adapter.addOne(account, state),
        account: account,
        loading: false
      };
    }


    default: {
      return state;
    }
  }
}


export const getUserAccountState = createFeatureSelector<AccountState>('userAccount');

export const getUserAccountEntitiesState = createSelector(
  getUserAccountState,
  state => state.list
);

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors(getUserAccountEntitiesState);

export const isLoading = createSelector(
  getUserAccountEntitiesState,
  state => state.loading
);

export const getUserAccount = createSelector(
  getUserAccountEntitiesState,
  state => state.account
);

export const getUserAccountName = createSelector(
  getUserAccountEntitiesState,
  state => state.userAccount
);

export const getUserDomainId = createSelector(
  getUserAccountEntitiesState,
  state => state.userDomainId
);

