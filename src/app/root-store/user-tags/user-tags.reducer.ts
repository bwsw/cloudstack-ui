import { UserTagsActionsUnion, UserTagsActionTypes } from './user-tags.actions';
import { Tag } from '../../shared/models';
import { initialState, UserTagsState } from './user-tags.state';


function getEntities(entities: Tag[]): { [id: string]: Tag } {
  return entities.reduce((dictionary, entity) => {
    dictionary[entity.key] = entity;
    return dictionary;
  }, {})
}

function getIds(entities: Tag[]): string[] {
  return entities.map(tag => tag.key)
}

function upsertMany(entities: Tag[], state: UserTagsState): UserTagsState {
  const upsertIds = getIds(entities);
  const upsertEntities = getEntities(entities);
  return {
    ...state,
    ids: [...state.ids, ...upsertIds],
    entities: {
      ...state.entities,
      ...upsertEntities
    }
  }
}

export function reducer(state = initialState, action: UserTagsActionsUnion): UserTagsState {
  switch (action.type) {
    case UserTagsActionTypes.LOAD_USER_TAGS: {
      return {
        ...state,
        isLoading: true
      };
    }

    case UserTagsActionTypes.USER_TAGS_LOADED: {
      const tags: Tag[] = action.payload.tags;
      return upsertMany(tags, { ...state, isLoading: false });
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
