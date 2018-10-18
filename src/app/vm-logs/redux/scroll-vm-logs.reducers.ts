import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as vmLogsActions from './vm-logs.actions';


export interface State {
  scrollId: string;
}

export const initialState: State = {
  scrollId: null
};

export function reducer(
  state = initialState,
  action: vmLogsActions.Actions
): State {
  switch (action.type) {
    case vmLogsActions.LOAD_VM_LOGS_RESPONSE: {
      return {
        scrollId: action.payload
      };
    }

    default: {
      return state;
    }
  }
}

export const getScrollVmLogsState = createFeatureSelector<State>('scrollVmLogs');

export const selectScrollId = createSelector(
  getScrollVmLogsState,
  state => state.scrollId
);

export const selectScrollEnabled = createSelector(
  getScrollVmLogsState,
  state => Boolean(state.scrollId)
);
