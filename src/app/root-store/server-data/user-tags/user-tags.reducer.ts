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
        isLoading: true,
      };
    }

    case UserTagsActionTypes.LoadUserTagsSuccess: {
      return adapter.upsertMany(action.payload.tags, { ...state, isLoading: false });
    }

    case UserTagsActionTypes.LoadUserTagsError: {
      return {
        ...state,
        isLoading: false,
      };
    }

    case UserTagsActionTypes.UpdateCustomServiceOfferingParams: {
      const { offering } = action.payload;
      const id = `${userTagKeys.computeOfferingParam}.${offering.id}`;
      const updates = [
        {
          key: `${id}.cpunumber`,
          value: offering.cpunumber.toString(),
        },
        {
          key: `${id}.cpuspeed`,
          value: offering.cpuspeed.toString(),
        },
        {
          key: `${id}.memory`,
          value: offering.memory.toString(),
        },
      ];
      return adapter.upsertMany(updates, state);
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
    case UserTagsActionTypes.SetSPFAVMSuccess:
    case UserTagsActionTypes.UpdateKeyboardLayoutForVmsSuccess:
    case UserTagsActionTypes.IncrementLastVMIdSuccess: {
      const update: Update<Tag> = { id: action.payload.key, changes: action.payload };
      return adapter.updateOne(update, state);
    }

    default: {
      return state;
    }
  }
}
