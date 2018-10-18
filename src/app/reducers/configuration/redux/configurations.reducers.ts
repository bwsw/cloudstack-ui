import { createFeatureSelector, createSelector } from '@ngrx/store';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import * as event from './configurations.actions';
import { Configuration } from '../../../shared/models/configuration.model';

/**
 * @ngrx/entity provides a predefined interface for handling
 * a structured dictionary of records. This interface
 * includes an array of ids, and a dictionary of the provided
 * model type by id. This interface is extended to include
 * any additional interface properties.
 */
export interface State extends EntityState<Configuration> {
  loading: boolean;
}

export interface ConfigurationsState {
  list: State;
}

export const configurationReducers = {
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
export const adapter: EntityAdapter<Configuration> = createEntityAdapter<Configuration>({
  selectId: (item: Configuration) => item.name,
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
    case event.LOAD_CONFIGURATIONS_REQUEST: {
      return {
        ...state,
        loading: true,
      };
    }

    case event.LOAD_CONFIGURATIONS_RESPONSE: {
      const configurations = action.payload;

      return {
        /**
         * The addMany function provided by the created adapter
         * adds many records to the entity dictionary
         * and returns a new state including those records. If
         * the collection is to be sorted, the adapter will
         * sort each record upon entry into the sorted array.
         */
        ...adapter.addAll(configurations, state),
        loading: false,
      };
    }
    default: {
      return state;
    }
  }
}

export const getConfigurationsState = createFeatureSelector<ConfigurationsState>('configurations');

export const getConfigurationsEntitiesState = createSelector(
  getConfigurationsState,
  state => state.list,
);

export const { selectIds, selectEntities, selectAll, selectTotal } = adapter.getSelectors(
  getConfigurationsEntitiesState,
);

export const isLoading = createSelector(getConfigurationsEntitiesState, state => state.loading);
