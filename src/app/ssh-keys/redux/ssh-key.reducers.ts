import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { SSHKeyPair } from '../../shared/models/ssh-keypair.model';
import * as sshKey from './ssh-key.actions';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { logging } from 'selenium-webdriver';

export interface State extends EntityState<SSHKeyPair> {
  filters: { selectedGroupings: string[] }
}

export interface SshKeysState {
  sshKeys: State;
}

export const reducers = {
  sshKeys: reducer
};

export const adapter: EntityAdapter<SSHKeyPair> = createEntityAdapter<SSHKeyPair>({
  selectId: (item: SSHKeyPair) => item.id,
  sortComparer: false
});

export const initialState: State = adapter.getInitialState({
  filters: {
    selectedGroupings: []
  }
});

export function reducer(
  state = initialState,
  action: sshKey.Actions
): State {
  switch (action.type) {
    case sshKey.LOAD_SSH_KEYS_REQUEST: {
      return {
        ...state,
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
    case sshKey.REMOVE_SSH_KEY_PAIR: {
      const sshKey = action.payload;
      console.log('removing', sshKey);
      return adapter.removeOne(sshKey, state);
    }
    case sshKey.CREATE_SSH_KEY_PAIR: {
      const sshKeyCreationData = action.payload;
      return adapter.addOne(sshKeyCreationData, state);
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

export const selectAllSshKeys = createSelector(selectAll, (sshKeys) => {
  console.log('sshKeys where they lose', sshKeys);

  return sshKeys;
});

export const selectFilteredSshKeys = createSelector(
  selectAll, filterSelectedGroupings, (array, selectedGroupings) => {
    return array;
  }
);
