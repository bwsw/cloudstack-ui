import { createEntityAdapter, EntityAdapter, EntityState, Update } from '@ngrx/entity';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Tag } from '../../../shared/models/tag.model';

import { AccountTagsActionTypes, Actions } from './account-tags.actions';

/**
 * @ngrx/entity provides a predefined interface for handling
 * a structured dictionary of records. This interface
 * includes an array of ids, and a dictionary of the provided
 * model type by id. This interface is extended to include
 * any additional interface properties.
 */
export interface State extends EntityState<Tag> {
  loading: boolean;
  loaded: boolean;
  isShowSystemTags: boolean;
}

export interface AccountTagsState {
  list: State;
}

export const accountTagsReducers = {
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
  sortComparer: false,
});

/** getInitialState returns the default initial state
 * for the generated entity state. Initial state
 * additional properties can also be defined.
 */
export const initialState: State = adapter.getInitialState({
  loading: false,
  loaded: false,
  isShowSystemTags: true,
});

export function reducer(state = initialState, action: Actions): State {
  switch (action.type) {
    case AccountTagsActionTypes.LoadAccountTagsRequest: {
      return {
        ...state,
        loading: true,
      };
    }
    case AccountTagsActionTypes.LoadAccountTagsResponse: {
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
        loaded: true,
      };
    }

    case AccountTagsActionTypes.UpdateAccountTagsFilter: {
      return {
        ...state,
        isShowSystemTags: action.payload.showSystemTag,
      };
    }

    case AccountTagsActionTypes.CreateTagSuccess: {
      return adapter.addOne(action.payload, state);
    }

    case AccountTagsActionTypes.DeleteTagSuccess: {
      return adapter.removeOne(action.payload, state);
    }

    case AccountTagsActionTypes.UpdateTagSuccess: {
      const update: Update<Tag> = { id: action.payload.oldKey, changes: action.payload.newTag };
      return adapter.updateOne(update, state);
    }

    default: {
      return state;
    }
  }
}

export const getAccountTagsState = createFeatureSelector<AccountTagsState>('tags');

export const getAccountTagsEntitiesState = createSelector(
  getAccountTagsState,
  state => state.list,
);

export const { selectIds, selectEntities, selectAll, selectTotal } = adapter.getSelectors(
  getAccountTagsEntitiesState,
);

export const isLoading = createSelector(
  getAccountTagsEntitiesState,
  state => state.loading,
);

export const isLoaded = createSelector(
  getAccountTagsEntitiesState,
  state => state.loaded,
);

export const getIsShowAccountSystemTags = createSelector(
  getAccountTagsEntitiesState,
  state => state.isShowSystemTags,
);
