import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Grouping } from '../../../shared/models/grouping.model';
import { SSHKeyPair } from '../../../shared/models/ssh-keypair.model';
import { Utils } from '../../../shared/services/utils/utils.service';

import * as fromAccounts from '../../accounts/redux/accounts.reducers';
import * as fromAuth from '../../auth/redux/auth.reducers';
import * as sshKeyActions from './ssh-key.actions';
import * as fromVMs from '../../vm/redux/vm.reducers';

export interface State {
  list: ListState;
  form: FormState;
}

export interface ListState extends EntityState<SSHKeyPair> {
  loading: boolean;
  filters: {
    selectedGroupings: Grouping[];
    selectedAccountIds: string[];
  };
}

export const sshKeyId = (sshKey: SSHKeyPair) => {
  return `${sshKey.domainid}-${sshKey.account}-${sshKey.name}`;
};

export const adapter: EntityAdapter<SSHKeyPair> = createEntityAdapter<SSHKeyPair>({
  selectId: sshKeyId,
  sortComparer: Utils.sortByName,
});

const initialListState: ListState = adapter.getInitialState({
  loading: false,
  filters: {
    selectedAccountIds: [],
    selectedGroupings: [],
  },
});

export interface FormState {
  loading: boolean;
  error: object;
}

const initialFormState: FormState = {
  loading: false,
  error: null,
};

export interface SshKeysState {
  list: ListState;
  form: FormState;
}

export const sshKeyReducers = {
  list: listReducer,
  form: formReducer,
};

export function listReducer(state = initialListState, action: sshKeyActions.Actions): ListState {
  switch (action.type) {
    case sshKeyActions.LOAD_SSH_KEYS_REQUEST: {
      return {
        ...state,
        loading: true,
      };
    }
    case sshKeyActions.SSH_KEY_FILTER_UPDATE: {
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.payload,
        },
      };
    }
    case sshKeyActions.LOAD_SSH_KEYS_RESPONSE: {
      return {
        /**
         * The addMany function provided by the created adapter
         * adds many records to the entity dictionary
         * and returns a new state including those records. If
         * the collection is to be sorted, the adapter will
         * sort each record upon entry into the sorted array.
         */
        ...adapter.addAll([...action.payload], state),
        loading: false,
      };
    }

    case sshKeyActions.SSH_KEY_PAIR_CREATE_SUCCESS: {
      return {
        ...adapter.addOne(action.payload, state),
      };
    }
    case sshKeyActions.SSH_KEY_PAIR_REMOVE_SUCCESS: {
      return adapter.removeOne(sshKeyId(action.payload), state);
    }
    default: {
      return state;
    }
  }
}

export function formReducer(state = initialFormState, action: sshKeyActions.Actions): FormState {
  switch (action.type) {
    case sshKeyActions.SSH_KEY_PAIR_REMOVE: {
      return {
        ...state,
        error: null,
      };
    }
    case sshKeyActions.SSH_KEY_PAIR_CREATE: {
      return {
        ...state,
        error: null,
        loading: true,
      };
    }
    case sshKeyActions.SSH_KEY_PAIR_CREATE_SUCCESS: {
      return {
        ...state,
        loading: false,
      };
    }
    case sshKeyActions.SSH_KEY_PAIR_REMOVE_ERROR: {
      return {
        ...state,
        error: action.payload,
      };
    }
    case sshKeyActions.SSH_KEY_PAIR_CREATE_ERROR: {
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    }
    default: {
      return state;
    }
  }
}

export const getSshKeysState = createFeatureSelector<SshKeysState>('sshKeys');

export const getSshKeysEntitiesState = createSelector(getSshKeysState, state => state.list);

export const getSshKeysFormState = createSelector(getSshKeysState, state => state.form);

export const { selectIds, selectEntities, selectAll, selectTotal } = adapter.getSelectors(
  getSshKeysEntitiesState,
);

export const filters = createSelector(getSshKeysEntitiesState, state => state.filters);

export const isLoading = createSelector(getSshKeysEntitiesState, state => state.loading);

export const isFormLoading = createSelector(getSshKeysFormState, state => state.loading);

export const filterSelectedGroupings = createSelector(filters, state => state.selectedGroupings);

export const filterSelectedAccountIds = createSelector(filters, state => state.selectedAccountIds);

export const selectFilteredSshKeys = createSelector(
  selectAll,
  filterSelectedAccountIds,
  fromAccounts.selectEntities,
  (sshKeys, selectedAccountIds, accountEntities) => {
    const accountDomainMap = selectedAccountIds
      .filter(id => accountEntities[id])
      .reduce((m, id) => {
        const acc = accountEntities[id];
        return { ...m, [`${acc.name}_${acc.domainid}`]: acc };
      }, {});

    const selectedAccountIdsFilter = sshKey =>
      !selectedAccountIds.length || accountDomainMap[`${sshKey.account}_${sshKey.domainid}`];

    return sshKeys.filter(selectedAccountIdsFilter);
  },
);

export const selectSSHKeys = createSelector(selectAll, fromVMs.getSelectedVM, (sshKeys, vm) => {
  const selectedVMFilter = sshKey =>
    vm && vm.account === sshKey.account && vm.domainid === sshKey.domainid;

  return sshKeys.filter(selectedVMFilter);
});

export const selectSshKeysForAccount = createSelector(
  selectAll,
  fromAuth.getUserAccount,
  (sshKeys, account) => {
    const filterSshKeysByAccount = (sshKey: SSHKeyPair) =>
      account && account.name === sshKey.account && account.domainid === sshKey.domainid;

    return sshKeys.filter(filterSshKeysByAccount);
  },
);
