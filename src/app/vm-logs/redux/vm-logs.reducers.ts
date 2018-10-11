import { createFeatureSelector, createSelector } from '@ngrx/store';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { VmLog } from '../models/vm-log.model';
import * as vmLogsActions from './vm-logs.actions';

export interface State extends EntityState<VmLog> {
  loading: boolean,
  filters: {
    selectedVmId: string,
  }
}

export interface VmLogsState {
  list: State;
}

export const vmLogsReducers = {
  list: reducer,
};

export const adapter: EntityAdapter<VmLog> = createEntityAdapter<VmLog>({
  selectId: () => Math.random(),
  sortComparer: false
});

export const initialState: State = adapter.getInitialState({
  loading: false,
  filters: {
    selectedVmId: null,
  }
});

export function reducer(
  state = initialState,
  action: vmLogsActions.Actions
): State {
  switch (action.type) {
    case vmLogsActions.LOAD_VM_LOGS_REQUEST: {
      return {
        ...state,
        loading: true
      };
    }

    case vmLogsActions.VM_LOGS_FILTER_UPDATE: {
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.payload
        }
      };
    }

    case vmLogsActions.LOAD_VM_LOGS_RESPONSE: {
      return {
        ...adapter.addAll([...action.payload], state),
        loading: false
      };
    }

    default: {
      return state;
    }
  }
}


export const getVmLogsState = createFeatureSelector<VmLogsState>('vmLogs');

export const getVmLogsEntitiesState = createSelector(
  getVmLogsState,
  state => state.list
);

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors(getVmLogsEntitiesState);

export const isLoading = createSelector(
  getVmLogsEntitiesState,
  state => state.loading
);

export const filters = createSelector(
  getVmLogsEntitiesState,
  state => state.filters
);

export const filterSelectedVmId = createSelector(
  filters,
  state => state.selectedVmId
);
