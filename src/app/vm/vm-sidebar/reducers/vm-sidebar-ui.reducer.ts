import { createFeatureSelector, createSelector } from '@ngrx/store';
import { VmLogsToken } from '../../../vm-logs/models/vm-log-token.model';
import * as vmLogsActions from '../../../vm-logs/redux/vm-logs.actions';

export interface State {
  loading: boolean;
  token: VmLogsToken;
}

export const initialState = {
  loading: false,
  token: null,
};

export function reducer(state = initialState, action: vmLogsActions.Actions): State {
  switch (action.type) {
    case vmLogsActions.VmLogsActionTypes.CREATE_TOKEN_REQUEST: {
      return {
        loading: true,
        token: null,
      };
    }

    case vmLogsActions.VmLogsActionTypes.CREATE_TOKEN_RESPONSE: {
      return {
        loading: false,
        token: action.payload,
      };
    }

    case vmLogsActions.VmLogsActionTypes.CREATE_TOKEN_ERROR: {
      return {
        loading: false,
        token: null,
      };
    }

    default: {
      return state;
    }
  }
}

export const getVmLogFilesState = createFeatureSelector<State>('vmSidebarUi');

export const isLoading = createSelector(
  getVmLogFilesState,
  state => state.loading,
);

export const getToken = createSelector(
  getVmLogFilesState,
  state => state.token,
);
