import { Update } from '@ngrx/entity';

import { UserTagsActionsUnion, UserTagsActionTypes } from './user-tags.actions';
import { adapter, initialState, UserTagsState } from './user-tags.state';
import { Tag } from '../../../shared/models';

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

    default: {
      return state;
    }
  }
}
