import {
  createFeatureSelector,
  createSelector
} from '@ngrx/store';
import {
  createEntityAdapter,
  EntityAdapter,
  EntityState
} from '@ngrx/entity';
import * as event from './service-offerings.actions';

import * as fromVMs from '../../vm/redux/vm.reducers';
import { ServiceOffering } from '../../../shared/models/service-offering.model';

/**
 * @ngrx/entity provides a predefined interface for handling
 * a structured dictionary of records. This interface
 * includes an array of ids, and a dictionary of the provided
 * model type by id. This interface is extended to include
 * any additional interface properties.
 */
export interface State extends EntityState<ServiceOffering> {
  loading: boolean;
}

export interface OfferingsState {
  list: State;
}

export const serviceOfferingReducers = {
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
export const adapter: EntityAdapter<ServiceOffering> = createEntityAdapter<ServiceOffering>({
  selectId: (item: ServiceOffering) => item.id,
  sortComparer: false
});

/** getInitialState returns the default initial state
 * for the generated entity state. Initial state
 * additional properties can also be defined.
 */
export const initialState: State = adapter.getInitialState({
  loading: false,
});

export function reducer(
  state = initialState,
  action: event.Actions
): State {
  switch (action.type) {
    case event.LOAD_SERVICE_OFFERINGS_REQUEST: {
      return {
        ...state,
        loading: true
      };
    }
    case event.LOAD_SERVICE_OFFERINGS_RESPONSE: {

      const offerings = action.payload;

      return {
        /**
         * The addMany function provided by the created adapter
         * adds many records to the entity dictionary
         * and returns a new state including those records. If
         * the collection is to be sorted, the adapter will
         * sort each record upon entry into the sorted array.
         */
        ...adapter.addAll(offerings, state),
        loading: false
      };
    }

    default: {
      return state;
    }
  }
}


export const getOfferingsState = createFeatureSelector<OfferingsState>('service-offerings');

export const getOfferingsEntitiesState = createSelector(
  getOfferingsState,
  state => state.list
);

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors(getOfferingsEntitiesState);

export const isLoading = createSelector(
  getOfferingsEntitiesState,
  state => state.loading
);

export const getSelectedOffering = createSelector(
  selectEntities,
  fromVMs.getSelectedVM,
  (entities, vm) => vm && entities[vm.serviceOfferingId]
);


