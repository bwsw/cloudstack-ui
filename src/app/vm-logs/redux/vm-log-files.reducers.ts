import { createFeatureSelector, createSelector } from '@ngrx/store';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import * as vmLogsActions from './vm-logs.actions';
import { VmLogFile } from '../models/vm-log-file.model';

export interface State extends EntityState<VmLogFile> {
  loading: boolean;
}

export interface VmLogFilesState {
  list: State;
}

export const vmLogFilesReducers = {
  list: reducer,
};

export const adapter: EntityAdapter<VmLogFile> = createEntityAdapter<VmLogFile>({
  selectId: file => file.file,
  sortComparer: false,
});

export const initialState: State = adapter.getInitialState({
  loading: false,
});

export function reducer(state = initialState, action: vmLogsActions.Actions): State {
  switch (action.type) {
    case vmLogsActions.VmLogsActionTypes.LOAD_VM_LOG_FILES_REQUEST: {
      return {
        ...adapter.removeAll(state),
        loading: true,
      };
    }

    case vmLogsActions.VmLogsActionTypes.LOAD_VM_LOG_FILES_RESPONSE: {
      return {
        ...adapter.addAll([...action.payload], state),
        loading: false,
      };
    }

    default: {
      return state;
    }
  }
}

export const getVmLogFilesState = createFeatureSelector<VmLogFilesState>('vmLogFiles');

export const getVmLogFilesEntitiesState = createSelector(getVmLogFilesState, state => state.list);

export const { selectIds, selectEntities, selectAll, selectTotal } = adapter.getSelectors(
  getVmLogFilesEntitiesState,
);

export const isLoading = createSelector(getVmLogFilesEntitiesState, state => state.loading);
