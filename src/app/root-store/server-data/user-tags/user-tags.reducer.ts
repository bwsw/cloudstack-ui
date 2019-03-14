import { Update } from '@ngrx/entity';
import { Tag } from '../../../shared/models';
import { userTagKeys } from '../../../tags/tag-keys';
import { UserTagsActionsUnion, UserTagsActionTypes } from './user-tags.actions';
import { adapter, initialState, UserTagsState } from './user-tags.state';

export function reducer(state = initialState, action: UserTagsActionsUnion): UserTagsState {
  switch (action.type) {
    case UserTagsActionTypes.SetDefaultUserTagsAtStartup:
    case UserTagsActionTypes.SetDefaultUserTagsDueToLogout: {
      return adapter.addAll(action.payload.tags, state);
    }

    case UserTagsActionTypes.SetDefaultUserTagDueToDelete: {
      return action.payload ? adapter.upsertOne(action.payload, state) : state;
    }

    case UserTagsActionTypes.LoadUserTagsSuccess: {
      return adapter.upsertMany(action.payload.tags, { ...state, isLoaded: true });
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
    case UserTagsActionTypes.UpdateVmLogsShowLastMessagesSuccess:
    case UserTagsActionTypes.UpdateVmLogsShowLastMinutesSuccess:
    case UserTagsActionTypes.IncrementLastVMIdSuccess: {
      const update: Update<Tag> = { id: action.payload.key, changes: action.payload };
      return adapter.updateOne(update, state);
    }

    case UserTagsActionTypes.UpdateTagSuccess: {
      const update: Update<Tag> = { id: action.payload.oldKey, changes: action.payload.newTag };
      return adapter.updateOne(update, state);
    }

    /**
     * We skip confirmation from the server that a value successfully changed,
     * so we do not slow down UI interaction.
     */
    case UserTagsActionTypes.UpdateSidebarWidth: {
      const update: Update<Tag> = { id: userTagKeys.sidebarWidth, changes: action.payload };
      return adapter.updateOne(update, state);
    }

    case UserTagsActionTypes.CreateTagSuccess: {
      return adapter.addOne(action.payload, state);
    }

    case UserTagsActionTypes.DeleteTagSuccess: {
      return adapter.removeOne(action.payload, state);
    }

    case UserTagsActionTypes.UpdateUserTagsFilter: {
      return {
        ...state,
        isShowSystemTags: action.payload.showSystemTag,
      };
    }

    default: {
      return state;
    }
  }
}
