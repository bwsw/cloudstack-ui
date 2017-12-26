import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Dictionary } from '@ngrx/entity/src/models';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Snapshot } from '../../../shared/models';
import { Utils } from '../../../shared/services/utils/utils.service';

import * as snapshot from './snapshot.actions';
import * as volume from '../../volumes/redux/volumes.actions';

export interface State {
  list: ListState
}

export interface ListState extends EntityState<Snapshot> {
  loading: boolean,
  snapshotsByVolumeId: Dictionary<Snapshot[]>
}

export const adapter: EntityAdapter<Snapshot> = createEntityAdapter<Snapshot>({
  selectId: (item: Snapshot) => item.id,
  sortComparer: Utils.sortByName
});

const initialListState: ListState = adapter.getInitialState({
  loading: false,
  snapshotsByVolumeId: {}
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
        (m, i) => ({ ...m, [i.volumeid]: (m[i.volumeid] ? [...m[i.volumeid], i] : [i]) }),
        {}
      );

      const newState = {
        ...state,
        loading: false,
        snapshotsByVolumeId: reduceByVolumeId
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
    case snapshot.ADD_SNAPSHOT_SUCCESS: {
      return {
        ...adapter.addOne(action.payload, state)
      };
    }
    case snapshot.DELETE_SNAPSHOT_SUCCESS: {
      const newState = {
        ...state,
        snapshotsByVolumeId: {
          ...state.snapshotsByVolumeId,
          [action.payload.volumeid]: state.snapshotsByVolumeId[action.payload.volumeid]
            .filter(snapshot => snapshot.id !== action.payload.id)
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
  state => state.snapshotsByVolumeId
);
