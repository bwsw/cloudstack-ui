import { createFeatureSelector, createSelector } from '@ngrx/store';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Utils } from '../../../shared/services/utils/utils.service';
import { InstanceGroupActionTypes, Actions } from './instance-group.actions';
import { InstanceGroup } from '../../../shared/models';

export interface State extends EntityState<InstanceGroup> {
  loading: boolean;
}

export interface InstanceGroupState {
  list: State;
}

export const instanceGroupReducers = {
  list: listReducer,
};

export const adapter: EntityAdapter<InstanceGroup> = createEntityAdapter<InstanceGroup>({
  selectId: (item: InstanceGroup) => item.id,
  sortComparer: Utils.sortByName,
});

export const initialListState: State = adapter.getInitialState({
  loading: false,
});

export function listReducer(state = initialListState, action: Actions): State {
  switch (action.type) {
    case InstanceGroupActionTypes.LOAD_INSTANCE_GROUPS_REQUEST: {
      return {
        ...state,
        loading: true,
      };
    }

    case InstanceGroupActionTypes.LOAD_INSTANCE_GROUPS_RESPONSE: {
      return {
        ...adapter.addAll([...action.payload], state),
        loading: false,
      };
    }

    default: {
      return state;
    }
  }
}

export const getInstanceGroupsState = createFeatureSelector<InstanceGroupState>('instanceGroups');

export const getInstanceGroupsEntitiesState = createSelector(
  getInstanceGroupsState,
  state => state.list,
);

export const { selectIds, selectEntities, selectAll, selectTotal } = adapter.getSelectors(
  getInstanceGroupsEntitiesState,
);

export const selectInstanceGroupNames = createSelector(selectAll, groups =>
  groups.map(group => group.name),
);

export const isLoading = createSelector(getInstanceGroupsEntitiesState, state => state.loading);
