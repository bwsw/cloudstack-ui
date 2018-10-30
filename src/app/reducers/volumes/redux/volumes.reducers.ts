import { createFeatureSelector, createSelector } from '@ngrx/store';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Volume, VolumeType } from '../../../shared/models/volume.model';

import * as volumeActions from './volumes.actions';
import * as fromAccounts from '../../accounts/redux/accounts.reducers';
import * as fromVMs from '../../vm/redux/vm.reducers';
import * as fromSnapshots from '../../snapshots/redux/snapshot.reducers';
import { Snapshot } from '../../../shared/models';
import { VirtualMachine } from '../../../vm/shared/vm.model';

/**
 * @ngrx/entity provides a predefined interface for handling
 * a structured dictionary of records. This interface
 * includes an array of ids, and a dictionary of the provided
 * model type by id. This interface is extended to include
 * any additional interface properties.
 */
export interface State extends EntityState<Volume> {
  loading: boolean;
  loaded: boolean;
  selectedVolumeId: string | null;
  filters: {
    selectedZoneIds: string[];
    selectedTypes: string[];
    selectedAccountIds: string[];
    selectedGroupings: any[];
    query: string;
    spareOnly: boolean;
  };
}

interface FormState {
  loading: boolean;
}

export interface VolumesState {
  list: State;
  form: FormState;
}

export const volumeReducers = {
  list: reducer,
  form: formReducer,
};

const sortByGroups = (a: Volume, b: Volume) => {
  const aIsRoot = a.type === VolumeType.ROOT;
  const bIsRoot = b.type === VolumeType.ROOT;
  if (aIsRoot && bIsRoot) {
    return a.name.localeCompare(b.name);
  }
  if (!aIsRoot && !bIsRoot) {
    return a.name.localeCompare(b.name);
  }
  if (aIsRoot && !bIsRoot) {
    return -1;
  }
  if (!aIsRoot && bIsRoot) {
    return 1;
  }
  return 0;
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
  sortComparer: sortByGroups,
});

/** getInitialState returns the default initial state
 * for the generated entity state. Initial state
 * additional properties can also be defined.
 */
export const initialState: State = adapter.getInitialState({
  loading: false,
  loaded: false,
  selectedVolumeId: null,
  filters: {
    selectedZoneIds: [],
    selectedTypes: [],
    selectedAccountIds: [],
    selectedGroupings: [],
    query: '',
    spareOnly: false,
  },
});

const initialFormState: FormState = {
  loading: false,
};

export function reducer(state = initialState, action: volumeActions.Actions): State {
  switch (action.type) {
    case volumeActions.LOAD_VOLUMES_REQUEST: {
      return {
        ...state,
        loading: true,
      };
    }

    case volumeActions.VOLUME_FILTER_UPDATE: {
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.payload,
        },
      };
    }

    case volumeActions.LOAD_VOLUMES_RESPONSE: {
      const volumes = action.payload;
      return {
        ...adapter.addAll([...volumes], state),
        loading: false,
        loaded: true,
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
        selectedVolumeId: action.payload,
      };
    }

    default: {
      return state;
    }
  }
}

export function formReducer(state = initialFormState, action: volumeActions.Actions): FormState {
  switch (action.type) {
    case volumeActions.CREATE_VOLUME_FROM_SNAPSHOT:
    case volumeActions.CREATE_VOLUME: {
      return { ...state, loading: true };
    }
    case volumeActions.CREATE_VOLUME_FROM_SNAPSHOT_SUCCESS:
    case volumeActions.VOLUME_CREATE_SUCCESS:
    case volumeActions.VOLUME_CREATE_ERROR: {
      return { ...state, loading: false };
    }
    default: {
      return state;
    }
  }
}

export const getVolumesState = createFeatureSelector<VolumesState>('volumes');

export const getVolumesEntitiesState = createSelector(getVolumesState, state => state.list);

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal: getVolumesCount,
} = adapter.getSelectors(getVolumesEntitiesState);

export const isLoading = createSelector(getVolumesEntitiesState, state => state.loading);

export const isLoaded = createSelector(getVolumesEntitiesState, state => state.loaded);

export const getSelectedId = createSelector(
  getVolumesEntitiesState,
  state => state.selectedVolumeId,
);

export const getSelectedVolume = createSelector(
  getVolumesState,
  getSelectedId,
  (state, selectedId) => state.list.entities[selectedId],
);

export const filters = createSelector(getVolumesEntitiesState, state => state.filters);

export const filterSelectedTypes = createSelector(filters, state => state.selectedTypes);

export const filterSelectedZoneIds = createSelector(filters, state => state.selectedZoneIds);

export const filterSelectedAccountIds = createSelector(filters, state => state.selectedAccountIds);

export const filterSelectedGroupings = createSelector(filters, state => state.selectedGroupings);

export const filterQuery = createSelector(filters, state => state.query);

export const filterSpareOnly = createSelector(filters, state => state.spareOnly);

export const isFormLoading = createSelector(getVolumesState, state => state.form.loading);

export const selectVolumesWithSnapshots = createSelector(
  selectAll,
  fromSnapshots.selectAll,
  (volumes: Volume[], snapshots: Snapshot[]) => {
    const snapshotsByVolumeMap = snapshots.reduce((dictionary, snapshot: Snapshot) => {
      const snapshotsByVolume = dictionary[snapshot.volumeid];
      dictionary[snapshot.volumeid] = snapshotsByVolume
        ? [...snapshotsByVolume, snapshot]
        : [snapshot];
      return dictionary;
    }, {});

    return volumes.map((volume: Volume) => {
      return {
        ...volume,
        snapshots: snapshotsByVolumeMap[volume.id],
      };
    });
  },
);

export const getSelectedVolumeWithSnapshots = createSelector(
  selectVolumesWithSnapshots,
  getSelectedId,
  (volumes, selectedId) => {
    const list = volumes.reduce((m, i) => ({ ...m, [i.id]: i }), {});

    return list[selectedId];
  },
);

export const selectSpareOnlyVolumes = createSelector(
  selectAll,
  fromVMs.getSelectedVM,
  (volumes: Volume[], vm: VirtualMachine) => {
    const zoneFilter = (volume: Volume) => vm && volume.zoneid === vm.zoneid;
    const spareOnlyFilter = (volume: Volume) => !volume.virtualmachineid;
    const accountFilter = (volume: Volume) =>
      vm && (volume.account === vm.account && volume.domainid === vm.domainid);

    return volumes.filter(
      volume => zoneFilter(volume) && spareOnlyFilter(volume) && accountFilter(volume),
    );
  },
);

export const selectVmVolumes = createSelector(
  selectVolumesWithSnapshots,
  fromVMs.getSelectedId,
  (volumes, virtualMachineId) => {
    const virtualMachineIdFilter = (volume: Volume) =>
      !virtualMachineId || volume.virtualmachineid === virtualMachineId;

    return volumes.filter(volume => {
      return virtualMachineIdFilter(volume);
    });
  },
);

export const selectFilteredVolumes = createSelector(
  selectVolumesWithSnapshots,
  filterQuery,
  filterSpareOnly,
  filterSelectedTypes,
  filterSelectedZoneIds,
  filterSelectedAccountIds,
  fromAccounts.selectAll,
  (volumes, query, spareOnly, selectedTypes, selectedZoneIds, selectedAccountIds, accounts) => {
    const queryLower = query && query.toLowerCase();
    const typesMap = selectedTypes.reduce((m, i) => ({ ...m, [i]: i }), {});
    const zoneIdsMap = selectedZoneIds.reduce((m, i) => ({ ...m, [i]: i }), {});

    const selectedAccounts = accounts.filter(account =>
      selectedAccountIds.find(id => id === account.id),
    );
    const accountsMap = selectedAccounts.reduce((m, i) => ({ ...m, [i.name]: i }), {});
    const domainsMap = selectedAccounts.reduce((m, i) => ({ ...m, [i.domainid]: i }), {});

    const spareOnlyFilter = (volume: Volume) => (spareOnly ? !volume.virtualmachineid : true);

    const queryFilter = (volume: Volume) =>
      !query || volume.name.toLowerCase().includes(queryLower);

    const selectedTypesFilter = (volume: Volume) =>
      !selectedTypes.length || !!typesMap[volume.type];

    const selectedZoneIdsFilter = (volume: Volume) =>
      !selectedZoneIds.length || !!zoneIdsMap[volume.zoneid];

    const selectedAccountIdsFilter = (volume: Volume) =>
      !selectedAccountIds.length || (accountsMap[volume.account] && domainsMap[volume.domainid]);

    return volumes.filter(volume => {
      return (
        spareOnlyFilter(volume) &&
        queryFilter(volume) &&
        selectedZoneIdsFilter(volume) &&
        selectedTypesFilter(volume) &&
        selectedAccountIdsFilter(volume)
      );
    });
  },
);
