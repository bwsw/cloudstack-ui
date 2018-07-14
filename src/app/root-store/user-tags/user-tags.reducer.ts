import { Update } from '@ngrx/entity';

import { UserTagsActionsUnion, UserTagsActionTypes } from './user-tags.actions';
import { adapter, initialState, UserTagsState } from './user-tags.state';
import { Tag } from '../../shared/models';

export function reducer(state = initialState, action: UserTagsActionsUnion): UserTagsState {
  switch (action.type) {
    case UserTagsActionTypes.LOAD_USER_TAGS: {
      return {
        ...state,
        isLoading: true
      };
    }

    case UserTagsActionTypes.USER_TAGS_LOADED: {
      const updates: Update<Tag>[] = action.payload.tags.map(tag => ({ id: tag.key, changes: tag }));
      return adapter.upsertMany(updates, { ...state, isLoading: false });
    }

    case UserTagsActionTypes.USER_TAGS_LOAD_ERROR: {
      return {
        ...state,
        isLoading: false
      };
    }

    default: {
      return state;
    }
  }
}
