import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Dictionary } from '@ngrx/entity/src/models';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Snapshot, SnapshotPageMode } from '../../../shared/models';

import * as snapshot from './snapshot.actions';
import * as volume from '../../volumes/redux/volumes.actions';
import * as moment from 'moment';

export interface State {
  list: ListState
}

export interface ListState extends EntityState<Snapshot> {
  loading: boolean,
  filters: {
    mode: SnapshotPageMode
  }
  snapshotIdsByVolumeId: Dictionary<string[]>,
  selectedSnapshotId: string | null
}

const sortByCreation = (snapshot1: Snapshot, snapshot2: Snapshot) => {
  const date1 = moment(snapshot1.created);
  const date2 = moment(snapshot2.created);
  return moment.max(date1, date2) === date1 ? -1 : 1;
};

export const adapter: EntityAdapter<Snapshot> = createEntityAdapter<Snapshot>({
  selectId: (item: Snapshot) => item.id,
  sortComparer: sortByCreation
});

export const initialListState: ListState = adapter.getInitialState({
  loading: false,
  filters: {
    mode: SnapshotPageMode.Volume
  },
  snapshotIdsByVolumeId: {},
  selectedSnapshotId: ''
});

export interface SnapshotState {
  list: ListState;
}

export const snapshotReducers = {
  list: listReducer
};


export function listReducer(
  state = initialListState,
  action: snapshot.Actions | volume.Actions
): ListState {
  switch (action.type) {
    case snapshot.LOAD_SNAPSHOT_REQUEST: {
      return {
        ...state,
        loading: true,
      };
    }
    case snapshot.LOAD_SNAPSHOT_RESPONSE: {
      const reduceByVolumeId = action.payload.reduce(
        (m, i) => ({
          ...m,
          [i.volumeid]: (m[i.volumeid] ? [...m[i.volumeid], i.id] : [i.id])
        }), {}
      );

      const newState = {
        ...state,
        loading: false,
        snapshotIdsByVolumeId: reduceByVolumeId
      };
      return {
        /**
         * The addMany function provided by the created adapter
         * adds many records to the entity dictionary
         * and returns a new state including those records. If
         * the collection is to be sorted, the adapter will
         * sort each record upon entry into the sorted array.
         */
        ...adapter.addAll([...action.payload], newState)
      };
    }
    case snapshot.SNAPSHOT_FILTER_UPDATE: {
      return { ...state, filters: { ...state.filters, ...action.payload } };
    }
    case snapshot.LOAD_SELECTED_SNAPSHOT: {
      return {
        ...state,
        selectedSnapshotId: action.payload
      };
    }
    case snapshot.ADD_SNAPSHOT_SUCCESS: {
      const newState = {
        ...state,
        snapshotIdsByVolumeId: {
          ...state.snapshotIdsByVolumeId,
          [action.payload.volumeid]: state.snapshotIdsByVolumeId[action.payload.volumeid]
            ? [action.payload.id, ...state.snapshotIdsByVolumeId[action.payload.volumeid]]
            : [action.payload.id]
        }
      };
      return {
        ...adapter.addOne(action.payload, newState)
      };
    }
    case snapshot.DELETE_SNAPSHOT_SUCCESS: {
      const newState = {
        ...state,
        snapshotIdsByVolumeId: {
          ...state.snapshotIdsByVolumeId,
          [action.payload.volumeid]: state.snapshotIdsByVolumeId[action.payload.volumeid]
            .filter(snapshotId => snapshotId !== action.payload.id)
        }
      };
      return {
        ...adapter.removeOne(action.payload.id, newState)
      };
    }
    default: {
      return state;
    }
  }
}

export const getSnapshotsState = createFeatureSelector<SnapshotState>('snapshots');

export const getSnapshotEntitiesState = createSelector(
  getSnapshotsState,
  state => state.list
);

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors(getSnapshotEntitiesState);

export const isLoading = createSelector(
  getSnapshotEntitiesState,
  state => state.loading
);

export const selectSnapshotsByVolumeId = createSelector(
  getSnapshotEntitiesState,
  state => state.snapshotIdsByVolumeId
);

export const getSelectedSnapshot = createSelector(
  getSnapshotEntitiesState,
  state => state.entities[state.selectedSnapshotId]
);

export const filters = createSelector(
  getSnapshotEntitiesState,
  state => state.filters
);

export const viewMode = createSelector(
  filters,
  state => state.mode
);

export const selectFilteredSnapshots = createSelector(
  selectAll,
  filters,
  (snapshots, filter) => {
    const filterByViewMode = (snapshot: Snapshot) =>
      (filter.mode === SnapshotPageMode.Volume && !!snapshot.volumeid)
      || (filter.mode === SnapshotPageMode.VM && !!snapshot.virtualmachineid);
    return snapshots.filter((snapshot: Snapshot) => filterByViewMode(snapshot));
  }
);
