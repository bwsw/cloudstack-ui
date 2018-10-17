import { createFeatureSelector, createSelector } from '@ngrx/store';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import * as vmLogsActions from './vm-logs.actions';
import { VmLogFile } from '../models/vm-log-file.model';
import { LoadVmLogFilesRequestParams } from '../models/load-vm-log-files-request-params';
import { filterSelectedVmId } from './vm-logs-vm.reducers';

export interface State extends EntityState<VmLogFile> {
  loading: boolean,
  filters: {
    selectedLogFile: string
  }
}

export interface VmLogFilesState {
  list: State;
}

export const vmLogFilesReducers = {
  list: reducer,
};

export const adapter: EntityAdapter<VmLogFile> = createEntityAdapter<VmLogFile>({
  selectId: file => file.file,
  sortComparer: false
});

export const initialState: State = adapter.getInitialState({
  loading: false,
  filters: {
    selectedLogFile: null
  }
});

export function reducer(
  state = initialState,
  action: vmLogsActions.Actions
): State {
  switch (action.type) {
    case vmLogsActions.LOAD_VM_LOG_FILES_REQUEST: {
      return {
        ...state,
        loading: true
      };
    }

    case vmLogsActions.LOAD_VM_LOG_FILES_RESPONSE: {
      return {
        ...adapter.addAll([...action.payload], state),
        loading: false
      };
    }

    case vmLogsActions.VM_LOGS_UPDATE_LOG_FILE: {
      return {
        ...state,
        filters: {
          ...state.filters,
          selectedLogFile: action.payload
        }
      };
    }

    default: {
      return state;
    }
  }
}


export const getVmLogFilesState = createFeatureSelector<VmLogFilesState>('vmLogFiles');

export const getVmLogFilesEntitiesState = createSelector(
  getVmLogFilesState,
  state => state.list
);

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors(getVmLogFilesEntitiesState);

export const isLoading = createSelector(
  getVmLogFilesEntitiesState,
  state => state.loading
);

export const filters = createSelector(
  getVmLogFilesEntitiesState,
  state => state.filters
);

export const filterSelectedLogFile = createSelector(
  filters,
  state => state.selectedLogFile
);
