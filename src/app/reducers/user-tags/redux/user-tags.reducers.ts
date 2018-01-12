import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Tag } from '../../../shared/models/tag.model';
import { UserTagKeys } from '../../../shared/services/tags/user-tag-keys';

import * as event from './user-tags.actions';


/**
 * @ngrx/entity provides a predefined interface for handling
 * a structured dictionary of records. This interface
 * includes an array of ids, and a dictionary of the provided
 * model type by id. This interface is extended to include
 * any additional interface properties.
 */
export interface State extends EntityState<Tag> {
  loading: boolean,
}

export interface UserTagsState {
  list: State;
}

export const userTagsReducers = {
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
export const adapter: EntityAdapter<Tag> = createEntityAdapter<Tag>({
  selectId: (item: Tag) => item.key,
  sortComparer: false
});

/** getInitialState returns the default initial state
 * for the generated entity state. Initial state
 * additional properties can also be defined.
 */
export const initialState: State = adapter.getInitialState({
  loading: false
});

export function reducer(
  state = initialState,
  action: event.Actions
): State {
  switch (action.type) {
    case event.LOAD_USER_TAGS_REQUEST: {
      return {
        ...state,
        loading: true
      };
    }
    case event.LOAD_USER_TAGS_RESPONSE: {
      return {
        /**
         * The addMany function provided by the created adapter
         * adds many records to the entity dictionary
         * and returns a new state including those records. If
         * the collection is to be sorted, the adapter will
         * sort each record upon entry into the sorted array.
         */
        ...adapter.addAll(action.payload, state),
        loading: false
      };
    }
    case event.UPDATE_CUSTOM_SERVICE_OFFERING_PARAMS_SUCCESS: {
      const id = `${UserTagKeys.serviceOfferingParam}.${action.payload.id}.cpuNumber`;

      if (state.ids.indexOf(id) > -1) {
        return {
          ...adapter.updateMany([
            {
              id: `${UserTagKeys.serviceOfferingParam}.${action.payload.id}.cpuNumber`,
              changes: { value: action.payload.cpunumber }
            },
            {
              id: `${UserTagKeys.serviceOfferingParam}.${action.payload.id}.cpuSpeed`,
              changes: { value: action.payload.cpuspeed }
            },
            {
              id: `${UserTagKeys.serviceOfferingParam}.${action.payload.id}.memory`,
              changes: { value: action.payload.memory }
            }
          ], state)
        };
      }
      return {
        ...adapter.addMany([
          {
            key: `${UserTagKeys.serviceOfferingParam}.${action.payload.id}.cpuNumber`,
            value: action.payload.cpunumber
          },
          {
            key: `${UserTagKeys.serviceOfferingParam}.${action.payload.id}.cpuSpeed`,
            value: action.payload.cpuspeed
          },
          {
            key: `${UserTagKeys.serviceOfferingParam}.${action.payload.id}.memory`,
            value: action.payload.memory
          }
        ], state)
      };
    }
    default: {
      return state;
    }
  }
}


export const getUserTagsState = createFeatureSelector<UserTagsState>('user-tags');

export const getUserTagsEntitiesState = createSelector(
  getUserTagsState,
  state => state.list
);

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors(getUserTagsEntitiesState);

export const isLoading = createSelector(
  getUserTagsEntitiesState,
  state => state.loading
);

export const selectServiceOfferingClassTags = createSelector(
  selectAll,
  (tags) => {
    return tags.filter(tag => tag.key.includes(UserTagKeys.serviceOfferingClass));
  }
);

export const selectServiceOfferingParamTags = createSelector(
  selectAll,
  (tags) => {
    return tags.filter(tag => tag.key.includes(UserTagKeys.serviceOfferingParam));
  }
);


