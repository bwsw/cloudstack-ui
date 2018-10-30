import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AffinityGroup } from '../../../shared/models';

import * as affinityGroupActions from './affinity-groups.actions';
import { Utils } from '../../../shared/services/utils/utils.service';

/**
 * @ngrx/entity provides a predefined interface for handling
 * a structured dictionary of records. This interface
 * includes an array of ids, and a dictionary of the provided
 * model type by id. This interface is extended to include
 * any additional interface properties.
 */
export interface State extends EntityState<AffinityGroup> {
  loading: boolean;
}

export interface AffinityGroupsState {
  list: State;
}

export const affinityGroupReducers = {
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
export const adapter: EntityAdapter<AffinityGroup> = createEntityAdapter<AffinityGroup>({
  selectId: (item: AffinityGroup) => item.id,
  sortComparer: Utils.sortByName,
});

/** getInitialState returns the default initial state
 * for the generated entity state. Initial state
 * additional properties can also be defined.
 */
export const initialState: State = adapter.getInitialState({
  loading: false,
});

export function reducer(state = initialState, action: affinityGroupActions.Actions): State {
  switch (action.type) {
    case affinityGroupActions.LOAD_AFFINITY_GROUPS_REQUEST: {
      return {
        ...state,
        loading: true,
      };
    }
    case affinityGroupActions.LOAD_AFFINITY_GROUPS_RESPONSE: {
      return {
        /**
         * The addMany function provided by the created adapter
         * adds many records to the entity dictionary
         * and returns a new state including those records. If
         * the collection is to be sorted, the adapter will
         * sort each record upon entry into the sorted array.
         */
        ...adapter.addAll(action.payload, state),
        loading: false,
      };
    }
    case affinityGroupActions.CREATE_AFFINITY_GROUP_SUCCESS: {
      return adapter.addOne(action.payload, state);
    }
    default: {
      return state;
    }
  }
}

export const getAffinityGroupsState = createFeatureSelector<AffinityGroupsState>('affinity-groups');

export const getAffinityGroupEntitiesState = createSelector(
  getAffinityGroupsState,
  state => state.list,
);

export const { selectIds, selectEntities, selectAll, selectTotal } = adapter.getSelectors(
  getAffinityGroupEntitiesState,
);

export const isLoading = createSelector(getAffinityGroupEntitiesState, state => state.loading);
