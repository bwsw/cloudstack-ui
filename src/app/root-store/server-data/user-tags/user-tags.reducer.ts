import { Update } from '@ngrx/entity';

import { UserTagsActionsUnion, UserTagsActionTypes } from './user-tags.actions';
import { adapter, initialState, UserTagsState } from './user-tags.state';
import { Tag } from '../../../shared/models';
import { userTagKeys } from '../../../tags/tag-keys';

export function reducer(state = initialState, action: UserTagsActionsUnion): UserTagsState {
  switch (action.type) {
    case UserTagsActionTypes.SetDefaultUserTagsAtStartup:
    case UserTagsActionTypes.SetDefaultUserTagsDueToLogout: {
      return adapter.addAll(action.payload.tags, state);
    }

    case UserTagsActionTypes.LoadUserTags: {
      return {
        ...state,
        isLoading: true
      };
    }

    case UserTagsActionTypes.LoadUserTagsSuccess: {
      const updates: Update<Tag>[] = action.payload.tags.map(tag => ({ id: tag.key, changes: tag }));
      return adapter.upsertMany(updates, { ...state, isLoading: false });
    }

    case UserTagsActionTypes.LoadUserTagsError: {
      return {
        ...state,
        isLoading: false
      };
    }

    case UserTagsActionTypes.UpdateCustomServiceOfferingParamsSuccess: {
      const id = `${userTagKeys.serviceOfferingParam}.${action.payload.id.toString()}.cpunumber`;
      if ((state.ids as string[]).indexOf(id) > -1) {
        return {
          ...adapter.updateMany([
            {
              id: `${userTagKeys.serviceOfferingParam}.${action.payload.id}.cpunumber`,
              changes: { value: action.payload.cpunumber.toString() }
            },
            {
              id: `${userTagKeys.serviceOfferingParam}.${action.payload.id}.cpuspeed`,
              changes: { value: action.payload.cpuspeed.toString() }
            },
            {
              id: `${userTagKeys.serviceOfferingParam}.${action.payload.id}.memory`,
              changes: { value: action.payload.memory.toString() }
            }
          ], state)
        };
      } else {
        return {
          ...adapter.addMany([
            {
              key: `${userTagKeys.serviceOfferingParam}.${action.payload.id}.cpunumber`,
              value: action.payload.cpunumber.toString()
            },
            {
              key: `${userTagKeys.serviceOfferingParam}.${action.payload.id}.cpuspeed`,
              value: action.payload.cpuspeed.toString()
            },
            {
              key: `${userTagKeys.serviceOfferingParam}.${action.payload.id}.memory`,
              value: action.payload.memory.toString()
            }
          ], state)
        };
      }
    }

    case UserTagsActionTypes.UpdateAskToCreateVMSuccess:
    case UserTagsActionTypes.UpdateAskToCreateVolumeSuccess:
    case UserTagsActionTypes.UpdateSPFAVMSuccess:
    case UserTagsActionTypes.UpdateFirstDayOfWeekSuccess:
    case UserTagsActionTypes.UpdateInterfaceLanguageSuccess:
    case UserTagsActionTypes.UpdateLastVMIdSuccess:
    case UserTagsActionTypes.UpdateSessionTimeoutSuccess:
    case UserTagsActionTypes.UpdateShowSystemTagsSuccess:
    case UserTagsActionTypes.UpdateTimeFormatSuccess:
    case UserTagsActionTypes.UpdateThemeSuccess:
    case UserTagsActionTypes.UpdateNavigationOrderSuccess:
    case UserTagsActionTypes.SetSPFAVMSuccess:
    case UserTagsActionTypes.IncrementLastVMIdSuccess: {
      const update: Update<Tag> = { id: action.payload.key, changes: action.payload };
      return adapter.updateOne(update, state);
    }

    case UserTagsActionTypes.OpenSidenav: {
      const update: Update<Tag> = { id: userTagKeys.sidenavVisible, changes: { value: 'true' } };
      return adapter.updateOne(update, state);
    }

    case UserTagsActionTypes.CloseSidenav: {
      const update: Update<Tag> = { id: userTagKeys.sidenavVisible, changes: { value: 'false '} };
      return adapter.updateOne(update, state);
    }

    default: {
      return state;
    }
  }
}
