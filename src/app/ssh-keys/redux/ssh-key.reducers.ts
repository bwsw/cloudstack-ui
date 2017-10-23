import {
  createEntityAdapter,
  EntityAdapter,
  EntityState
} from '@ngrx/entity';
import { SSHKeyPair } from '../../shared/models/ssh-keypair.model';
import {
  createFeatureSelector,
  createSelector
} from '@ngrx/store';
import { accounts } from '../../reducers/accounts/redux/accounts.reducers';

import * as sshKey from './ssh-key.actions';

export interface State {
  list: ListState,
  form: FormState
}

export interface ListState extends EntityState<SSHKeyPair> {
  filters: {
    selectedGroupings: any[],
    selectedAccountIds: string[]
  }
}

const initialListState: ListState = {
  ids: [],
  entities: null,
  filters: {
    selectedAccountIds: [],
    selectedGroupings: []
  }
};

export interface FormState {
  loading: boolean,
  error: object
}

const initialFormState: FormState = {
  loading: false,
  error: null
};


export interface SshKeysState {
  list: ListState;
  form: FormState;
}

export const sshKeyReducers = {
  list: listReducer,
  form: formReducer
};

export const sshKeyId = (sshKey: SSHKeyPair) => {
  return `${sshKey.domainid}-${sshKey.account}-${sshKey.name}`;
};

export const sortByName = (a: SSHKeyPair, b: SSHKeyPair) => {
  return a.name.localeCompare(b.name);
};

export const adapter: EntityAdapter<SSHKeyPair> = createEntityAdapter<SSHKeyPair>({
  selectId: sshKeyId,
  sortComparer: sortByName
});

export function listReducer(state = initialListState, action: sshKey.Actions): ListState {
  switch (action.type) {
    case sshKey.LOAD_SSH_KEYS_REQUEST: {
      return {
        ...state
      };
    }
    case sshKey.SSH_KEY_FILTER_UPDATE: {
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.payload
        }
      };
    }
    case sshKey.LOAD_SSH_KEYS_RESPONSE: {
      return {
        /**
         * The addMany function provided by the created adapter
         * adds many records to the entity dictionary
         * and returns a new state including those records. If
         * the collection is to be sorted, the adapter will
         * sort each record upon entry into the sorted array.
         */
        ...adapter.addAll([...action.payload], state),
      };
    }

    case sshKey.SSH_KEY_PAIR_CREATE_SUCCESS: {

      return {
        ...adapter.addOne(action.payload, state),
      };
    }
    case sshKey.SSH_KEY_PAIR_REMOVE_SUCCESS: {
      return adapter.removeOne(action.payload, state);
    }
    default: {
      return state;
    }
  }
}

export function formReducer(state = initialFormState, action: sshKey.Actions): FormState {
  switch (action.type) {
    case sshKey.SSH_KEY_PAIR_REMOVE: {
      return {
        ...state,
        error: null,
      };
    }
    case sshKey.SSH_KEY_PAIR_CREATE: {
      return {
        ...state,
        error: null,
        loading: true
      };
    }
    case sshKey.SSH_KEY_PAIR_CREATE_SUCCESS: {
      return {
        ...state,
        loading: false
      };
    }
    case sshKey.SSH_KEY_PAIR_REMOVE_ERROR: {
      return {
        ...state,
        error: action.payload
      };
    }
    case sshKey.SSH_KEY_PAIR_CREATE_ERROR: {
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    }
    default: {
      return state;
    }
  }
}

export const getSshKeysState = createFeatureSelector<SshKeysState>('sshKeys');

export const getSshKeysEntitiesState = createSelector(
  getSshKeysState,
  state => state.list
);

export const getSshKeysFormState = createSelector(
  getSshKeysState,
  state => state.form
);

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors(getSshKeysEntitiesState);

export const filters = createSelector(
  getSshKeysEntitiesState,
  state => state.filters
);

export const isLoading = createSelector(
  getSshKeysFormState,
  state => state.loading
);

export const filterSelectedGroupings = createSelector(
  filters,
  state => state.selectedGroupings
);

export const filterSelectedAccountIds = createSelector(
  filters,
  state => state.selectedAccountIds
);

export const selectFilteredSshKeys = createSelector(
  selectAll,
  filterSelectedAccountIds,
  accounts,
  (sshKeys, selectedAccountIds, accounts) => {

    const selectedAccounts = accounts.filter(account => selectedAccountIds.find(id => id === account.id));
    const accountsMap = selectedAccounts.reduce((m, i) => ({...m, [i.name]: i }), {});
    const domainsMap = selectedAccounts.reduce((m, i) => ({...m, [i.domainid]: i }), {});

    const selectedAccountIdsFilter = sshKey => !selectedAccountIds.length ||
      (accountsMap[sshKey.account] && domainsMap[sshKey.domainid]);

    return sshKeys.filter(sshKey => selectedAccountIdsFilter(sshKey));
  }
);
