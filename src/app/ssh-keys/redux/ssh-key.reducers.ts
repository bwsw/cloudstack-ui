import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { SSHKeyPair } from '../../shared/models/ssh-keypair.model';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Account } from '../../shared/models/account.model';
import * as sshKey from './ssh-key.actions';
import { falseIfMissing } from 'protractor/built/util';


export interface State extends EntityState<SSHKeyPair> {
  filters: {
    selectedGroupings: any[],
    selectedAccounts: Account[]
  },
  error: Object,
  form: {
    loading: boolean
  }
}

export interface SshKeysState {
  list: State;
}

export const sshKeyReducers = {
  list: reducer
};

export const adapter: EntityAdapter<SSHKeyPair> = createEntityAdapter<SSHKeyPair>({
  selectId: (item: SSHKeyPair) => `${item.account}-${item.name}`,
  sortComparer: false
});

export const initialState: State = adapter.getInitialState({
  filters: {
    selectedGroupings: [],
    selectedAccounts: []
  },
  error: null,
  form: {
    loading: false
  }
});

export function reducer(
  state = initialState,
  action: sshKey.Actions
): State {

  console.log(state, action);

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
      const sshKeys = action.payload;

      return {
        /**
         * The addMany function provided by the created adapter
         * adds many records to the entity dictionary
         * and returns a new state including those records. If
         * the collection is to be sorted, the adapter will
         * sort each record upon entry into the sorted array.
         */
        ...adapter.addAll(sshKeys, state),
      };
    }
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
        form: { loading: true }
      };
    }
    case sshKey.SSH_KEY_PAIR_CREATE_SUCCESS: {
      // or just addOne() but it will add new element to the end of array

      return {
        ...state,
        ids: [action.payload.name, ...state.ids],
        entities: { [action.payload.name]: action.payload, ...state.entities },
        form: { loading: false }
      };
    }
    case sshKey.SSH_KEY_PAIR_REMOVE_SUCCESS: {
      if (action.payload.success) {
        return adapter.removeOne(action.payload.name, state);
      } else {
        break;
      }
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
        form: { loading: false },
        error: action.payload
      };
    }
    case sshKey.GET_SSH_KEY_PAIR: {
      return state;
    }
    default: {
      return state;
    }
  }
}

export const getSshKeysState = createFeatureSelector<SshKeysState>('list');

export const getSshKeysEntitiesState = createSelector(
  getSshKeysState,
  state => state.list
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
  getSshKeysEntitiesState,
  state => state.form.loading
);

export const filterSelectedGroupings = createSelector(
  filters,
  state => state.selectedGroupings
);

export const filterSelectedAccounts = createSelector(
  filters,
  state => state.selectedAccounts
);

export const selectFilteredSshKeys = createSelector(
  selectAll,
  filterSelectedAccounts,
  (sshKeys, selectedAccounts) => {
    const accountsMap = selectedAccounts.reduce((m, i) => ({ ...m, [i.name]: i }), {});
    const selectedAccountsFilter = (sshKey: SSHKeyPair) =>
      !selectedAccounts.length || !!accountsMap[sshKey.account]
      && accountsMap[sshKey.account].domainid === sshKey.domainid;
    return sshKeys.filter(sshKey => selectedAccountsFilter(sshKey));
  }
);

export const selectSshKeyActionError = createSelector(
  getSshKeysEntitiesState,
  state => state.error
);
