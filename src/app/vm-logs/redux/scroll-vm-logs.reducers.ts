import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as vmLogsActions from './vm-logs.actions';
import { ofType } from '@ngrx/effects';


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
    case vmLogsActions.LOAD_VM_LOGS_SCROLL_RESPONSE:
    case vmLogsActions.SCROLL_VM_LOGS_RESPONSE: {
      return {
        scrollId: action.payload.scrollid
      };
    }

    case vmLogsActions.STOP_SCROLL_VM_LOGS: {
      return {
        scrollId: null
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
