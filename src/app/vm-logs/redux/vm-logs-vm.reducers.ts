import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as vmLogsActions from './vm-logs.actions';

export interface State {
  selectedVmId: string;
  selectedAccountIds: string[];
}

export const initialState: State = {
  selectedVmId: null,
  selectedAccountIds: [],
};

export function reducer(state = initialState, action: vmLogsActions.Actions): State {
  switch (action.type) {
    case vmLogsActions.VmLogsActionTypes.VM_LOGS_UPDATE_VM_ID: {
      return {
        ...state,
        selectedVmId: action.payload,
      };
    }

    case vmLogsActions.VmLogsActionTypes.VM_LOGS_UPDATE_ACCOUNT_IDS: {
      return {
        ...state,
        selectedAccountIds: action.payload,
      };
    }

    default: {
      return state;
    }
  }
}

export const getVmLogsVmState = createFeatureSelector<State>('vmLogsVm');

export const filterSelectedVmId = createSelector(getVmLogsVmState, state => state.selectedVmId);

export const filterSelectedAccountIds = createSelector(
  getVmLogsVmState,
  state => state.selectedAccountIds,
);
