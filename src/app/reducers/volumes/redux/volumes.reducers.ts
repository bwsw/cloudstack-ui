import { createFeatureSelector, createSelector } from '@ngrx/store';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Volume } from '../../../shared/models/volume.model';
import { Utils } from '../../../shared/services/utils/utils.service';

import * as volumeActions from './volumes.actions';
import * as fromAccounts from '../../accounts/redux/accounts.reducers';
import * as fromVMs from '../../vm/redux/vm.reducers';
import * as fromSnapshots from '../../snapshots/redux/snapshot.reducers';

/**
 * @ngrx/entity provides a predefined interface for handling
 * a structured dictionary of records. This interface
 * includes an array of ids, and a dictionary of the provided
 * model type by id. This interface is extended to include
 * any additional interface properties.
 */
export interface State extends EntityState<Volume> {
  loading: boolean,
  selectedVolumeId: string | null;
  filters: {
    selectedZoneIds: string[],
    selectedTypes: string[],
    selectedAccountIds: string[],
    selectedGroupings: any[],
    query: string,
    spareOnly: boolean,
  }
}

export interface VolumesState {
  list: State;
}

export const volumeReducers = {
  list: reducer,
};

/**
 * createEntityAdapter creates many an object of helper
 * functions for single or multiple operations
 * against the dictionary of records. The configuration
 * object takes a record id selector function and
 * a sortComparer option which is set to a compare
 * function if the records are to be sorted.
 */
export const adapter: EntityAdapter<Volume> = createEntityAdapter<Volume>({
  selectId: (item: Volume) => item.id,
  sortComparer: Utils.sortByName
});

/** getInitialState returns the default initial state
 * for the generated entity state. Initial state
 * additional properties can also be defined.
 */
export const initialState: State = adapter.getInitialState({
  loading: false,
  selectedVolumeId: null,
  filters: {
    selectedZoneIds: [],
    selectedTypes: [],
    selectedAccountIds: [],
    selectedGroupings: [],
    query: '',
    spareOnly: false
  }
});

export function reducer(
  state = initialState,
  action: volumeActions.Actions
): State {
  switch (action.type) {
    case volumeActions.LOAD_VOLUMES_REQUEST: {
      return {
        ...state,
        loading: true
      };
    }

    case volumeActions.VOLUME_FILTER_UPDATE: {
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.payload
        }
      };
    }

    case volumeActions.LOAD_VOLUMES_RESPONSE: {

      const volumes = action.payload;

      return {
        /**
         * The addMany function provided by the created adapter
         * adds many records to the entity dictionary
         * and returns a new state including those records. If
         * the collection is to be sorted, the adapter will
         * sort each record upon entry into the sorted array.
         */
        ...adapter.addAll([...volumes], state),
        loading: false
      };
    }

    case volumeActions.VOLUME_CREATE_SUCCESS: {
      return {
        ...adapter.addOne(action.payload, state),
      };
    }

    case volumeActions.RESIZE_VOLUME_SUCCESS:
    case volumeActions.UPDATE_VOLUME: {
      return {
        ...adapter.updateOne({ id: action.payload.id, changes: action.payload }, state),
      };
    }

    case volumeActions.REPLACE_VOLUME: {
      const newState = adapter.removeOne(action.payload.id, state);
      return {
        ...adapter.addOne(action.payload, newState),
      };
    }

    case volumeActions.VOLUME_DELETE_SUCCESS: {
      return {
        ...adapter.removeOne(action.payload.id, state),
      };
    }

    case volumeActions.LOAD_SELECTED_VOLUME: {
      return {
        ...state,
        selectedVolumeId: action.payload
      };
    }


    default: {
      return state;
    }
  }
}


export const getVolumesState = createFeatureSelector<VolumesState>('volumes');

export const getVolumesEntitiesState = createSelector(
  getVolumesState,
  state => state.list
);

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors(getVolumesEntitiesState);

export const isLoading = createSelector(
  getVolumesEntitiesState,
  state => state.loading
);

export const getSelectedId = createSelector(
  getVolumesEntitiesState,
  state => state.selectedVolumeId
);

export const getSelectedVolume = createSelector(
  getVolumesState,
  getSelectedId,
  (state, selectedId) => state.list.entities[selectedId]
);

export const filters = createSelector(
  getVolumesEntitiesState,
  state => state.filters
);

export const filterSelectedTypes = createSelector(
  filters,
  state => state.selectedTypes
);

export const filterSelectedZoneIds = createSelector(
  filters,
  state => state.selectedZoneIds
);

export const filterSelectedAccountIds = createSelector(
  filters,
  state => state.selectedAccountIds
);

export const filterSelectedGroupings = createSelector(
  filters,
  state => state.selectedGroupings
);

export const filterQuery = createSelector(
  filters,
  state => state.query
);

export const filterSpareOnly = createSelector(
  filters,
  state => state.spareOnly
);

export const selectVolumesWithSnapshots = createSelector(
  selectAll,
  fromSnapshots.selectEntities,
  fromSnapshots.selectSnapshotsByVolumeId,
  (volumes, snapshots, snapshotIdsByVolumeId) => {
    return volumes.map(
      volume => {
        const snapshotsOfVolume = snapshotIdsByVolumeId[volume.id]
          ? snapshotIdsByVolumeId[volume.id].map(snapshotId => snapshots[snapshotId])
          : [];
        return {
          ...volume,
          snapshots: snapshotsOfVolume
        };
      });
  }
);

export const getSelectedVolumeWithSnapshots = createSelector(
  selectVolumesWithSnapshots,
  getSelectedId,
  (volumes, selectedId) => {
    const list = volumes.reduce((m, i) => ({ ...m, [i.id]: i }), {});

    return list[selectedId];
  }
);


export const selectSpareOnlyVolumes = createSelector(
  selectVolumesWithSnapshots,
  fromVMs.getSelectedVM,
  (volumes, vm) => {
    const zoneFilter = (volume) => vm && volume.zoneId === vm.zoneId;
    const spareOnlyFilter = volume => !volume.virtualMachineId;
    const accountFilter =
      volume => vm && (volume.account === vm.account && volume.domainid === vm.domainid);

    return volumes.filter(
      volume => zoneFilter(volume) && spareOnlyFilter(volume) && accountFilter(volume));
  }
);

export const selectVmVolumes = createSelector(
  selectVolumesWithSnapshots,
  fromVMs.getSelectedId,
  (volumes, virtualMachineId) => {

    const virtualMachineIdFilter = volume => !virtualMachineId ||
      volume.virtualMachineId === virtualMachineId;

    return volumes.filter(volume => {
      return virtualMachineIdFilter(volume);
    });
  }
);

export const selectFilteredVolumes = createSelector(
  selectVolumesWithSnapshots,
  filterQuery,
  filterSpareOnly,
  filterSelectedTypes,
  filterSelectedZoneIds,
  filterSelectedAccountIds,
  fromAccounts.selectAll,
  (
    volumes, query,
    spareOnly, selectedTypes,
    selectedZoneIds, selectedAccountIds,
    accounts
  ) => {
    const queryLower = query && query.toLowerCase();
    const typesMap = selectedTypes.reduce((m, i) => ({ ...m, [i]: i }), {});
    const zoneIdsMap = selectedZoneIds.reduce((m, i) => ({ ...m, [i]: i }), {});

    const selectedAccounts = accounts.filter(
      account => selectedAccountIds.find(id => id === account.id));
    const accountsMap = selectedAccounts.reduce((m, i) => ({ ...m, [i.name]: i }), {});
    const domainsMap = selectedAccounts.reduce((m, i) => ({ ...m, [i.domainid]: i }), {});

    const spareOnlyFilter = volume => spareOnly ? !volume.virtualMachineId : true;

    const queryFilter = volume => !query || volume.name.toLowerCase()
        .includes(queryLower) ||
      volume.description.toLowerCase().includes(queryLower);

    const selectedTypesFilter =
      volume => !selectedTypes.length || !!typesMap[volume.type];

    const selectedZoneIdsFilter =
      volume => !selectedZoneIds.length || !!zoneIdsMap[volume.zoneId];

    const selectedAccountIdsFilter = volume => !selectedAccountIds.length ||
      (accountsMap[volume.account] && domainsMap[volume.domainid]);


    return volumes.filter(volume => {
      return spareOnlyFilter(volume)
        && queryFilter(volume)
        && selectedZoneIdsFilter(volume)
        && selectedTypesFilter(volume)
        && selectedAccountIdsFilter(volume);
    });
  }
);

