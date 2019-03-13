import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as vmLogsActions from './vm-logs.actions';
import { DateObject } from '../models/date-object.model';

export interface State {
  isAutoUpdateEnabled: boolean;
  startDate: DateObject;
  endDate: DateObject;
}

export const initialState: State = {
  isAutoUpdateEnabled: false,
  startDate: null,
  endDate: null,
};

export function reducer(state = initialState, action: vmLogsActions.Actions): State {
  switch (action.type) {
    case vmLogsActions.VmLogsActionTypes.ENABLE_AUTO_UPDATE: {
      return {
        ...state,
        isAutoUpdateEnabled: true,
      };
    }

    case vmLogsActions.VmLogsActionTypes.DISABLE_AUTO_UPDATE: {
      return {
        ...state,
        isAutoUpdateEnabled: false,
      };
    }

    case vmLogsActions.VmLogsActionTypes.SET_AUTO_UPDATE_START_DATE: {
      return {
        ...state,
        startDate: action.payload,
      };
    }

    case vmLogsActions.VmLogsActionTypes.SET_AUTO_UPDATE_END_DATE: {
      return {
        ...state,
        endDate: action.payload,
      };
    }

    default: {
      return state;
    }
  }
}

export const getVmLogsAutoUpdateState = createFeatureSelector<State>('vmLogsAutoUpdate');

export const selectIsAutoUpdateEnabled = createSelector(
  getVmLogsAutoUpdateState,
  state => state.isAutoUpdateEnabled,
);

export const selectStartDate = createSelector(
  getVmLogsAutoUpdateState,
  state => state.startDate,
);

export const selectEndDate = createSelector(
  getVmLogsAutoUpdateState,
  state => state.endDate,
);
