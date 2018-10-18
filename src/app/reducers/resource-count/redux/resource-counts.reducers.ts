import { createFeatureSelector, createSelector } from '@ngrx/store';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import * as event from './resource-counts.actions';
import { ResourceCount } from '../../../shared/models/resource-count.model';

/**
 * @ngrx/entity provides a predefined interface for handling
 * a structured dictionary of records. This interface
 * includes an array of ids, and a dictionary of the provided
 * model type by id. This interface is extended to include
 * any additional interface properties.
 */
export interface State extends EntityState<ResourceCount> {
  loading: boolean;
}

export interface ResourceCountsState {
  list: State;
}

export const resourceCountsReducers = {
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
export const adapter: EntityAdapter<ResourceCount> = createEntityAdapter<ResourceCount>({
  selectId: (item: ResourceCount) => item.resourcetype.toString(),
  sortComparer: false,
});

/** getInitialState returns the default initial state
 * for the generated entity state. Initial state
 * additional properties can also be defined.
 */
export const initialState: State = adapter.getInitialState({
  loading: false,
});

export function reducer(state = initialState, action: event.Actions): State {
  switch (action.type) {
    case event.LOAD_RESOURCE_COUNTS_REQUEST: {
      return {
        ...state,
        loading: true,
      };
    }
    case event.LOAD_RESOURCE_COUNTS_RESPONSE: {
      const resourceCounts = action.payload;

      return {
        /**
         * The addMany function provided by the created adapter
         * adds many records to the entity dictionary
         * and returns a new state including those records. If
         * the collection is to be sorted, the adapter will
         * sort each record upon entry into the sorted array.
         */
        ...adapter.addAll(resourceCounts, state),
        loading: false,
      };
    }

    default: {
      return state;
    }
  }
}

export const getResourceCountsState = createFeatureSelector<ResourceCountsState>('resourceCounts');

export const getResourceCountsEntitiesState = createSelector(
  getResourceCountsState,
  state => state.list,
);

export const { selectIds, selectEntities, selectAll, selectTotal } = adapter.getSelectors(
  getResourceCountsEntitiesState,
);

export const isLoading = createSelector(getResourceCountsEntitiesState, state => state.loading);
