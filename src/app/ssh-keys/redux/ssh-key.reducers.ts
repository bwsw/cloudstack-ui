import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { SSHKeyPair } from '../../shared/models/ssh-keypair.model';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Account } from '../../shared/models/account.model';
import * as sshKey from './ssh-key.actions';


export interface State extends EntityState<SSHKeyPair> {
  filters: {
    selectedGroupings: any[],
    selectedAccounts: Account[]
  },
  selectedSshKeyName: string | null,
  error: Object;
}

export interface SshKeysState {
  sshKeys: State;
}

export const reducers = {
  sshKeys: reducer
};

export const adapter: EntityAdapter<SSHKeyPair> = createEntityAdapter<SSHKeyPair>({
  selectId: (item: SSHKeyPair) => item.name,
  sortComparer: false
});

export const initialState: State = adapter.getInitialState({
  selectedSshKeyName: null,
  filters: {
    selectedGroupings: [],
    selectedAccounts: []
  },
  error: null
});

export function reducer(
  state = initialState,
  action: sshKey.Actions
): State {
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
      return state;
    }
    case sshKey.SSH_KEY_PAIR_CREATE: {
      return {
        ...Object.assign({}, state, {
          selectedSshKeyName: action.payload.name
        }),
        filters: {
          ...state.filters,
        }
      };
    }
    case sshKey.SSH_KEY_PAIR_CREATE_SUCCESS: {
      return adapter.addOne(action.payload, state);
    }
    case sshKey.SSH_KEY_PAIR_REMOVE_ERROR:
    case sshKey.SSH_KEY_PAIR_CREATE_ERROR: {
      return {
        ...state,
        error: action.payload
      };
    }
    case sshKey.SSH_KEY_PAIR_REMOVE_SUCCESS: {
      if (action.payload.success) {
        return adapter.removeOne(action.payload.name, state);
      } else {
        break;
      }
    }
    case sshKey.GET_SSH_KEY_PAIR: {
      return action.payload;
    }
    default: {
      return state;
    }
  }
}

export const getSshKeysState = createFeatureSelector<SshKeysState>('sshKeys');

export const getSshKeysEntitiesState = createSelector(
  getSshKeysState,
  state => state.sshKeys
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

export const selectSshKey = createSelector(
  selectAll,
  getSshKeysEntitiesState,
  (sshKeys, state) => {
    return sshKeys.find(entity => entity.name === state.selectedSshKeyName);
  }
);

export const selectSshKeyActionError = createSelector(
  getSshKeysEntitiesState,
  state => state.error
);
