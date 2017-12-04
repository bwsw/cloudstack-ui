import {
  createFeatureSelector,
  createSelector
} from '@ngrx/store';
import {
  createEntityAdapter,
  EntityAdapter,
  EntityState
} from '@ngrx/entity';
import * as event from './vm.actions';
import { VirtualMachine } from '../../../vm';

import * as fromAccounts from '../../accounts/redux/accounts.reducers';
import * as fromAuth from '../../auth/redux/auth.reducers';
import * as fromSGroup from '../../security-groups/redux/sg.reducers';
import { VirtualMachineTagKeys } from '../../../shared/services/tags/vm-tag-keys';
import { InstanceGroup } from '../../../shared/models';
import { noGroup } from '../../../vm/vm-filter/vm-filter.component';

/**
 * @ngrx/entity provides a predefined interface for handling
 * a structured dictionary of records. This interface
 * includes an array of ids, and a dictionary of the provided
 * model type by id. This interface is extended to include
 * any additional interface properties.
 */
export interface State extends EntityState<VirtualMachine> {
  loading: boolean,
  selectedVMId: string,
  filters: {
    selectedZoneIds: string[],
    selectedGroupNames: string[],
    selectedStates: string[],
    selectedAccountIds: string[],
    selectedGroupings: any[],
    query: string,
  }
}

export interface VirtualMachineState {
  list: State;
}

export const virtualMachineReducers = {
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
export const adapter: EntityAdapter<VirtualMachine> = createEntityAdapter<VirtualMachine>(
  {
    selectId: (item: VirtualMachine) => item.id,
    sortComparer: false
  });

/** getInitialState returns the default initial state
 * for the generated entity state. Initial state
 * additional properties can also be defined.
 */
export const initialState: State = adapter.getInitialState({
  loading: false,
  selectedVMId: null,
  filters: {
    selectedZoneIds: [],
    selectedGroupNames: [],
    selectedStates: [],
    selectedAccountIds: [],
    selectedGroupings: [],
    query: '',
  }
});

export function reducer(
  state = initialState,
  action: event.Actions
): State {
  switch (action.type) {
    case event.LOAD_VMS_REQUEST: {
      return {
        ...state,
        loading: true
      };
    }

    case event.VM_FILTER_UPDATE: {
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.payload
        }
      };
    }

    case event.LOAD_SELECTED_VM: {
      return {
        ...state,
        selectedVMId: action.payload
      };
    }

    case event.LOAD_VMS_RESPONSE: {

      const vms = action.payload;

      return {
        /**
         * The addMany function provided by the created adapter
         * adds many records to the entity dictionary
         * and returns a new state including those records. If
         * the collection is to be sorted, the adapter will
         * sort each record upon entry into the sorted array.
         */
        ...adapter.addAll(vms, state),
        loading: false
      };
    }

    case event.UPDATE_VM: {
      return {
        ...adapter.updateOne({ id: action.payload.id, changes: action.payload }, state),
      };
    }

    case event.REPLACE_VM: {
      const newState = adapter.removeOne(action.payload.id, state);
      return {
        ...adapter.addOne(action.payload, newState),
      };
    }

    case event.CREATE_VM_SUCCESS: {
      return {
        ...adapter.addOne(action.payload, state),
      };
    }

    case event.EXPUNGE_VM_SUCCESS: {
      return {
        ...adapter.removeOne(action.payload.id, state),
      };
    }

    default: {
      return state;
    }
  }
}


export const getVMsState = createFeatureSelector<VirtualMachineState>('virtualMachines');

export const getVMsEntitiesState = createSelector(
  getVMsState,
  state => state.list
);

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors(getVMsEntitiesState);

export const isLoading = createSelector(
  getVMsEntitiesState,
  state => state.loading
);

export const getSelectedId = createSelector(
  getVMsEntitiesState,
  state => state.selectedVMId
);

export const getSelectedVM = createSelector(
  getVMsState,
  getSelectedId,
  (state, selectedId) => state.list.entities[selectedId]
);

export const filters = createSelector(
  getVMsEntitiesState,
  state => state.filters
);

export const filterQuery = createSelector(
  filters,
  state => state.query
);


export const filterSelectedZoneIds = createSelector(
  filters,
  state => state.selectedZoneIds
);

export const filterSelectedStates = createSelector(
  filters,
  state => state.selectedStates
);

export const filterSelectedGroupNames = createSelector(
  filters,
  state => state.selectedGroupNames
);

export const filterSelectedAccountIds = createSelector(
  filters,
  state => state.selectedAccountIds
);

export const filterSelectedGroupings = createSelector(
  filters,
  state => state.selectedGroupings
);

export const selectVmGroups = createSelector(
  selectAll,
  (vms) => {
    const groups = vms.reduce((groupsMap, vm) => {
      const group = vm.tags.find(tag => tag.key === VirtualMachineTagKeys.group);

      if (group && group.value && !groupsMap[group.value]) {
        groupsMap[group.value] = new InstanceGroup(group.value);
      }
      return groupsMap;
    }, {});
    return groups ? Object.values(groups) : [];
  }
);

export const getUsingSGVMs = createSelector(
  selectAll,
  fromSGroup.getSelectedId,
  (vms, sGroupId) => {
    const sGroupFilter = vm => vm.securityGroup.find(group => group.id === sGroupId);
    return vms.filter(vm => sGroupFilter(vm));
  }
);

export const getAttachmentVMs = createSelector(
  selectAll,
  fromAuth.getUserAccount,
  (vms, account) => {
    const accountFilter =
      vm => (vm.account === account.name && vm.domainid === account.domainid);

    return vms.filter(vm => accountFilter(vm));
  }
);

export const selectFilteredVMs = createSelector(
  selectAll,
  filterQuery,
  filterSelectedStates,
  filterSelectedGroupNames,
  filterSelectedZoneIds,
  filterSelectedAccountIds,
  fromAccounts.selectAll,
  (
    vms,
    query,
    selectedStates,
    selectedGroupNames,
    selectedZoneIds,
    selectedAccountIds,
    accounts
  ) => {
    const queryLower = query && query.toLowerCase();
    const statesMap = selectedStates.reduce((m, i) => ({ ...m, [i]: i }), {});
    const zoneIdsMap = selectedZoneIds.reduce((m, i) => ({ ...m, [i]: i }), {});
    const groupNamesMap = selectedGroupNames.reduce((m, i) => ({ ...m, [i]: i }), {});

    const selectedAccounts = accounts.filter(
      account => selectedAccountIds.find(id => id === account.id));
    const accountsMap = selectedAccounts.reduce((m, i) => ({ ...m, [i.name]: i }), {});
    const domainsMap = selectedAccounts.reduce((m, i) => ({ ...m, [i.domainid]: i }), {});

    const queryFilter = vm => !query || vm.name.toLowerCase().includes(queryLower);

    const selectedStatesFilter = vm => !selectedStates.length || !!statesMap[vm.state];

    const selectedGroupNamesFilter = vm => !selectedGroupNames.length ||
      (!vm.instanceGroup && groupNamesMap[noGroup]) || (vm.instanceGroup && groupNamesMap[vm.instanceGroup.name]);

    const selectedZoneIdsFilter =
      vm => !selectedZoneIds.length || !!zoneIdsMap[vm.zoneId];

    const selectedAccountIdsFilter = vm => !selectedAccountIds.length ||
      (accountsMap[vm.account] && domainsMap[vm.domainid]);

    return vms.filter(vm => {
      return selectedStatesFilter(vm)
        && queryFilter(vm)
        && selectedGroupNamesFilter(vm)
        && selectedZoneIdsFilter(vm)
        && selectedAccountIdsFilter(vm);
    });
  }
);


