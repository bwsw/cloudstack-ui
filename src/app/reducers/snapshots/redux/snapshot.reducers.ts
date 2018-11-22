import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { getSnapshotDescription, Snapshot } from '../../../shared/models';
import * as snapshotPageSelectors from '../../../snapshot/store/snapshot-page.selectors';
import * as snapshotActions from './snapshot.actions';
import * as volumeActions from '../../volumes/redux/volumes.actions';
import * as moment from 'moment';
import { SnapshotPageViewMode } from '../../../snapshot/types';

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

export const getSelectedSnapshot = createSelector(
  getSnapshotEntitiesState,
  state => state.entities[state.selectedSnapshotId],
);

export const selectFilteredSnapshots = createSelector(
  selectAll,
  snapshotPageSelectors.getFilters,
  snapshotPageSelectors.getViewMode,
  (snapshots, filter, viewMode) => {
    const filterByViewMode = (snapshot: Snapshot) =>
      (viewMode === SnapshotPageViewMode.Volume && !!snapshot.volumeid) ||
      (viewMode === SnapshotPageViewMode.VM && !!snapshot.virtualmachineid);

    const filterByTypes = (snapshot: Snapshot) =>
      !filter.volumeSnapshotTypes.length ||
      !!filter.volumeSnapshotTypes.find(type => type === snapshot.snapshottype);

    const filterByAccount = (snapshot: Snapshot) =>
      !filter.accounts.length || !!filter.accounts.find(id => id === snapshot.account);

    const filterByDate = (snapshot: Snapshot) =>
      !filter.date ||
      moment(snapshot.created).isBetween(
        moment(filter.date).startOf('day'),
        moment(filter.date).endOf('day'),
      );

    const queryLower = filter.query && filter.query.toLowerCase();
    const filterByQuery = (snapshot: Snapshot) => {
      return (
        !filter.query ||
        snapshot.name.toLowerCase().indexOf(queryLower) > -1 ||
        (getSnapshotDescription(snapshot) &&
          getSnapshotDescription(snapshot)
            .toLowerCase()
            .indexOf(queryLower) > -1)
      );
    };

    return snapshots.filter(
      (snapshot: Snapshot) =>
        filterByViewMode(snapshot) &&
        filterByAccount(snapshot) &&
        filterByTypes(snapshot) &&
        filterByDate(snapshot) &&
        filterByQuery(snapshot),
    );
  },
);
