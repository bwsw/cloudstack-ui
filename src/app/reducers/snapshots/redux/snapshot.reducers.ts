import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as moment from 'moment';
import { Snapshot } from '../../../shared/models';
import * as volumeActions from '../../volumes/redux/volumes.actions';
import * as snapshotActions from './snapshot.actions';

export interface State {
  list: ListState;
}

export interface ListState extends EntityState<Snapshot> {
  loading: boolean;
  selectedSnapshotId: string | null;
}

const sortByCreation = (snapshot1: Snapshot, snapshot2: Snapshot) => {
  const date1 = moment(snapshot1.created);
  const date2 = moment(snapshot2.created);
  return moment.max(date1, date2) === date1 ? -1 : 1;
};

export const adapter: EntityAdapter<Snapshot> = createEntityAdapter<Snapshot>({
  selectId: (item: Snapshot) => item.id,
  sortComparer: sortByCreation,
});

export const initialListState: ListState = adapter.getInitialState({
  loading: false,
  snapshotIdsByVolumeId: {},
  selectedSnapshotId: '',
});

export interface SnapshotState {
  list: ListState;
}

export const snapshotReducers = {
  list: listReducer,
};

export function listReducer(
  state = initialListState,
  action: snapshotActions.Actions | volumeActions.Actions,
): ListState {
  switch (action.type) {
    case snapshotActions.LOAD_SNAPSHOT_REQUEST: {
      return {
        ...state,
        loading: true,
      };
    }

    case snapshotActions.LOAD_SNAPSHOT_RESPONSE: {
      const newState = {
        ...state,
        loading: false,
      };
      return adapter.addAll([...action.payload], newState);
    }

    case snapshotActions.LOAD_SELECTED_SNAPSHOT: {
      return {
        ...state,
        selectedSnapshotId: action.payload,
      };
    }

    case snapshotActions.ADD_SNAPSHOT_SUCCESS: {
      return adapter.upsertOne(action.payload, state);
    }

    case snapshotActions.DELETE_SNAPSHOT_SUCCESS: {
      return adapter.removeOne(action.payload.id, state);
    }
    default: {
      return state;
    }
  }
}

export const getSnapshotsState = createFeatureSelector<SnapshotState>('snapshots');

export const getSnapshotEntitiesState = createSelector(getSnapshotsState, state => state.list);

export const { selectIds, selectEntities, selectAll, selectTotal } = adapter.getSelectors(
  getSnapshotEntitiesState,
);

export const isLoading = createSelector(getSnapshotEntitiesState, state => state.loading);
