import { createFeatureSelector, createSelector } from '@ngrx/store';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Zone } from '../../../shared/models/zone.model';

import * as event from './zone.actions';

/**
 * @ngrx/entity provides a predefined interface for handling
 * a structured dictionary of records. This interface
 * includes an array of ids, and a dictionary of the provided
 * model type by id. This interface is extended to include
 * any additional interface properties.
 */
export interface State extends EntityState<Zone> {
  loading: boolean;
}

export interface ZoneState {
  list: State;
}

export const zoneReducers = {
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
export const adapter: EntityAdapter<Zone> = createEntityAdapter<Zone>({
  selectId: (item: Zone) => item.id,
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
    case event.LOAD_ZONES_REQUEST: {
      return {
        ...state,
        loading: true,
      };
    }
    case event.LOAD_ZONES_RESPONSE: {
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
    default: {
      return state;
    }
  }
}

export const getZonesState = createFeatureSelector<ZoneState>('zones');

export const getZonesEntitiesState = createSelector(getZonesState, state => state.list);

export const { selectIds, selectEntities, selectAll, selectTotal } = adapter.getSelectors(
  getZonesEntitiesState,
);

export const isLoading = createSelector(getZonesEntitiesState, state => state.loading);
