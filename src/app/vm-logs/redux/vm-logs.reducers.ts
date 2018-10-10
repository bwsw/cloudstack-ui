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

export const reducers = {
  list: reducer,
};

export const adapter: EntityAdapter<VmLog> = createEntityAdapter<VmLog>({
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

export const getEventsEntitiesState = createSelector(
  getVmLogsState,
  state => state.list
);

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors(getEventsEntitiesState);

export const isLoading = createSelector(
  getEventsEntitiesState,
  state => state.loading
);

export const filters = createSelector(
  getEventsEntitiesState,
  state => state.filters
);

export const filterSelectedVmId = createSelector(
  filters,
  state => state.selectedVmId
);
