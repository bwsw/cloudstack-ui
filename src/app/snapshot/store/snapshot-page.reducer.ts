import * as moment from 'moment';
import { Filters } from '../models/filters.model';
import { SnapshotPageViewMode } from '../types';
import { SnapshotPageActionsUnion, SnapshotPageActionTypes } from './snapshot-page.actions';

export interface SnapshotPageState {
  selectedId: string;
  viewMode: SnapshotPageViewMode;
  filters: Filters;
  groupings: any[];
}

export const initialState: SnapshotPageState = {
  selectedId: undefined,
  viewMode: SnapshotPageViewMode.Volume,
  filters: {
    accounts: [],
    vmIds: [],
    volumeVmIds: [],
    date: moment().toDate(),
    query: undefined,
    volumeSnapshotTypes: [],
  },
  groupings: [],
};

export const snapshotPageStoreName = 'snapshotPage';

export function snapshotPageReducer(
  state = initialState,
  action: SnapshotPageActionsUnion,
): SnapshotPageState {
  switch (action.type) {
    case SnapshotPageActionTypes.Select: {
      return {
        ...state,
        selectedId: action.payload.id,
      };
    }

    case SnapshotPageActionTypes.UpdateViewMode: {
      return {
        ...state,
        viewMode: action.payload.mode,
      };
    }

    case SnapshotPageActionTypes.UpdateFilters: {
      const updatedFilters: Filters = {
        ...state.filters,
        ...action.payload,
      };
      return {
        ...state,
        filters: updatedFilters,
      };
    }

    case SnapshotPageActionTypes.UpdateGroupings: {
      return {
        ...state,
        groupings: action.payload.groupings,
      };
    }

    default: {
      return state;
    }
  }
}
